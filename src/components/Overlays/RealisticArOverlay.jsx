import React, { useEffect, useRef, useState } from 'react';

/**
 * RealisticArOverlay
 * Real-time adaptive AR Face Tracker and realistic 3D cosmetic filters.
 * Dynamically detects head position, face width, forehead line and eye level,
 * automatically scaling and positioning Crown, Glasses, Cat Ears, Halo, etc.
 */
export default function RealisticArOverlay({ videoRef, activeSticker, isMirrored = false }) {
  const [faceData, setFaceData] = useState({
    x: 0.5,
    y: 0.38,
    width: 0.32,
    headTopY: 0.22,
    eyeY: 0.34,
    detected: false
  });

  const smoothX = useRef(0.5);
  const smoothY = useRef(0.38);
  const smoothW = useRef(0.32);
  const smoothTop = useRef(0.22);
  const smoothEye = useRef(0.34);

  const canvasRef = useRef(null);
  const animFrameId = useRef(null);
  const lastDetectTime = useRef(0);

  useEffect(() => {
    if (!activeSticker) return;

    // Create offscreen canvas for computer vision sampling
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = 80;
    offscreenCanvas.height = 60;
    const ctx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
    canvasRef.current = { canvas: offscreenCanvas, ctx };

    let detector = null;
    if (typeof window !== 'undefined' && 'FaceDetector' in window) {
      try {
        detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
      } catch (e) {
        detector = null;
      }
    }

    const processFrame = async () => {
      const video = videoRef?.current;
      const now = performance.now();

      if (video && video.readyState >= 2 && now - lastDetectTime.current >= 40) {
        lastDetectTime.current = now;

        let detected = false;
        let targetX = smoothX.current;
        let targetY = smoothY.current;
        let targetW = smoothW.current;
        let targetTop = smoothTop.current;
        let targetEye = smoothEye.current;

        // 1. Try Native FaceDetector if supported
        if (detector) {
          try {
            const faces = await detector.detect(video);
            if (faces && faces.length > 0) {
              const b = faces[0].boundingBox;
              const vw = video.videoWidth || 640;
              const vh = video.videoHeight || 480;

              let normX = (b.x + b.width / 2) / vw;
              let normY = (b.y + b.height / 2) / vh;
              let normW = b.width / vw;
              let normH = b.height / vh;

              targetX = Math.max(0.1, Math.min(0.9, normX));
              targetY = Math.max(0.1, Math.min(0.9, normY));
              targetW = Math.max(0.15, Math.min(0.65, normW));
              targetTop = Math.max(0.05, normY - normH * 0.55);
              targetEye = Math.max(0.1, normY - normH * 0.15);
              detected = true;
            }
          } catch (e) {
            // Fallback to canvas vision tracker
          }
        }

        // 2. Intelligent Canvas Vision Skin/Head Detection Fallback
        if (!detected && ctx && video.videoWidth > 0) {
          try {
            ctx.drawImage(video, 0, 0, 80, 60);
            const imgData = ctx.getImageData(0, 0, 80, 60);
            const data = imgData.data;

            let skinPixelCount = 0;
            let sumX = 0;
            let sumY = 0;
            let minX = 80;
            let maxX = 0;
            let minY = 60;
            let maxY = 0;

            // Sample upper 70% of frame where head resides
            for (let y = 4; y < 48; y++) {
              for (let x = 8; x < 72; x++) {
                const idx = (y * 80 + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];

                // Universal skin chromaticity bounds
                if (r > 65 && g > 40 && b > 20 && r > g && g > b && (r - g) > 10 && (r - b) > 15) {
                  skinPixelCount++;
                  sumX += x;
                  sumY += y;
                  if (x < minX) minX = x;
                  if (x > maxX) maxX = x;
                  if (y < minY) minY = y;
                  if (y > maxY) maxY = y;
                }
              }
            }

            // Minimum skin cluster for a human head in frame
            if (skinPixelCount > 70 && maxX > minX && maxY > minY) {
              const avgX = sumX / skinPixelCount / 80;
              const avgY = sumY / skinPixelCount / 60;
              const detectedW = Math.max(0.2, Math.min(0.6, (maxX - minX + 8) / 80));
              const detectedH = Math.max(0.2, (maxY - minY + 8) / 60);

              targetX = avgX;
              targetY = avgY;
              targetW = detectedW;
              targetTop = Math.max(0.06, (minY - 2) / 60);
              targetEye = Math.max(0.12, targetTop + detectedH * 0.35);
              detected = true;
            }
          } catch (err) {
            // Quietly retain previous smooth state
          }
        }

        // Smooth Exponential Moving Average (Lerp) for zero jitter
        const lerpFactor = detected ? 0.22 : 0.08;
        smoothX.current += (targetX - smoothX.current) * lerpFactor;
        smoothY.current += (targetY - smoothY.current) * lerpFactor;
        smoothW.current += (targetW - smoothW.current) * lerpFactor;
        smoothTop.current += (targetTop - smoothTop.current) * lerpFactor;
        smoothEye.current += (targetEye - smoothEye.current) * lerpFactor;

        setFaceData({
          x: smoothX.current,
          y: smoothY.current,
          width: smoothW.current,
          headTopY: smoothTop.current,
          eyeY: smoothEye.current,
          detected
        });
      }

      animFrameId.current = requestAnimationFrame(processFrame);
    };

    animFrameId.current = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [activeSticker, videoRef]);

  if (!activeSticker) return null;

  // Mirror adjustment: if front camera is mirrored, invert horizontal position
  const renderedX = isMirrored ? (1 - faceData.x) : faceData.x;
  const headTopPercent = faceData.headTopY * 100;
  const eyePercent = faceData.eyeY * 100;
  const centerPercent = renderedX * 100;

  // Responsive scale in pixels based on container width
  const baseWidthPx = Math.max(90, Math.min(320, faceData.width * 380));

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden select-none">
      
      {/* 1. REALISTIC 3D IMPERIAL GOLDEN CROWN */}
      {activeSticker === 'crown' && (
        <div
          className="absolute transform -translate-x-1/2 transition-transform duration-75 ease-out flex flex-col items-center"
          style={{
            left: `${centerPercent}%`,
            top: `${headTopPercent}%`,
            width: `${baseWidthPx * 1.18}px`,
            transform: 'translate(-50%, -88%)'
          }}
        >
          {/* Shimmer Light Glints & Rising Particles */}
          <div className="absolute -top-3 inset-x-0 flex justify-between px-2 pointer-events-none">
            <span className="text-amber-200 text-xs animate-ping">✨</span>
            <span className="text-yellow-100 text-xs animate-pulse">🌟</span>
            <span className="text-amber-300 text-xs animate-ping" style={{ animationDelay: '300ms' }}>✨</span>
          </div>

          {/* High-Definition 3D Imperial Gold Crown SVG */}
          <svg
            viewBox="0 0 200 130"
            className="w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] filter"
            style={{
              filter: 'drop-shadow(0 0 16px rgba(245,158,11,0.7)) drop-shadow(0 4px 8px rgba(0,0,0,0.8))'
            }}
          >
            <defs>
              <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2A3" />
                <stop offset="30%" stopColor="#FFD700" />
                <stop offset="70%" stopColor="#FFA000" />
                <stop offset="100%" stopColor="#FF8C00" />
              </linearGradient>
              <linearGradient id="crownShine" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FFE082" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FF8F00" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="rubyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D6D" />
                <stop offset="50%" stopColor="#C9184A" />
                <stop offset="100%" stopColor="#590D22" />
              </linearGradient>
              <linearGradient id="sapphireGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="70%" stopColor="#0072FF" />
                <stop offset="100%" stopColor="#001845" />
              </linearGradient>
              <radialGradient id="velvetBack" cx="50%" cy="80%" r="70%">
                <stop offset="0%" stopColor="#800020" />
                <stop offset="80%" stopColor="#30000B" />
              </radialGradient>
            </defs>

            {/* Velvet Cap Arches behind Crown */}
            <path d="M 25 105 Q 100 35 175 105 Z" fill="url(#velvetBack)" opacity="0.85" />

            {/* Main 5-Peak Golden Diadem Silhouette */}
            <path
              d="M 20 105 L 15 35 L 58 70 L 100 15 L 142 70 L 185 35 L 180 105 Z"
              fill="url(#crownGold)"
              stroke="#FFE885"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Interior Depth Carvings and Highlights */}
            <path
              d="M 30 100 L 26 48 L 60 74 L 100 30 L 140 74 L 174 48 L 170 100 Z"
              fill="url(#crownShine)"
              opacity="0.4"
            />

            {/* Lower Embossed Gem Band */}
            <rect x="18" y="98" width="164" height="18" rx="6" fill="#D97706" stroke="#FEF08A" strokeWidth="2" />
            <rect x="22" y="101" width="156" height="12" rx="4" fill="url(#crownGold)" />

            {/* Band Inset Diamonds */}
            <circle cx="36" cy="107" r="3.5" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1" />
            <circle cx="64" cy="107" r="4.5" fill="url(#rubyGlow)" stroke="#F43F5E" strokeWidth="1.2" />
            <circle cx="100" cy="107" r="5.5" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="136" cy="107" r="4.5" fill="url(#sapphireGlow)" stroke="#0EA5E9" strokeWidth="1.2" />
            <circle cx="164" cy="107" r="3.5" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1" />

            {/* Top Jewels on the 5 Peaks */}
            {/* Center Peak: Royal Brilliant Diamond */}
            <circle cx="100" cy="15" r="7" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="2" />
            <polygon points="100,6 104,15 100,24 96,15" fill="#FFFFFF" opacity="0.9" />

            {/* Intermediate Peaks: Rubies */}
            <circle cx="58" cy="70" r="5" fill="url(#rubyGlow)" stroke="#FDA4AF" strokeWidth="1.5" />
            <circle cx="142" cy="70" r="5" fill="url(#rubyGlow)" stroke="#FDA4AF" strokeWidth="1.5" />

            {/* Outer Peaks: Sapphires */}
            <circle cx="15" cy="35" r="5.5" fill="url(#sapphireGlow)" stroke="#7DD3FC" strokeWidth="1.5" />
            <circle cx="185" cy="35" r="5.5" fill="url(#sapphireGlow)" stroke="#7DD3FC" strokeWidth="1.5" />
          </svg>

          {/* Soft Forehead Cast Shadow */}
          <div
            className="w-3/4 h-3 bg-black/40 rounded-full blur-sm -mt-1 pointer-events-none"
            style={{ filter: 'blur(4px)' }}
          />
        </div>
      )}

      {/* 2. REALISTIC CYBERPUNK / LUXURY NEON SUNGLASSES */}
      {activeSticker === 'glasses' && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
          style={{
            left: `${centerPercent}%`,
            top: `${eyePercent}%`,
            width: `${baseWidthPx * 0.98}px`
          }}
        >
          <svg
            viewBox="0 0 200 70"
            className="w-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)] filter"
            style={{
              filter: 'drop-shadow(0 0 14px rgba(6,182,212,0.8))'
            }}
          >
            <defs>
              <linearGradient id="lensTint" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0F172A" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#1E1B4B" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#311042" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="specularGlint" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#22D3EE" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#C084FC" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="cyberFrame" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="50%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>

            {/* Left Frame & Polarized Lens */}
            <path
              d="M 20 18 L 85 18 C 92 18, 92 48, 75 58 C 55 68, 15 62, 12 36 Z"
              fill="url(#lensTint)"
              stroke="url(#cyberFrame)"
              strokeWidth="4"
            />
            {/* Left Lens Diagonal Specular Streak */}
            <polygon points="30,22 46,22 28,54 18,50" fill="url(#specularGlint)" opacity="0.65" />

            {/* Right Frame & Polarized Lens */}
            <path
              d="M 115 18 L 180 18 C 188 36, 185 62, 125 58 C 108 48, 108 18, 115 18 Z"
              fill="url(#lensTint)"
              stroke="url(#cyberFrame)"
              strokeWidth="4"
            />
            {/* Right Lens Diagonal Specular Streak */}
            <polygon points="125,22 141,22 123,54 113,50" fill="url(#specularGlint)" opacity="0.65" />

            {/* Bridge over Nose */}
            <path d="M 85 22 Q 100 16 115 22" fill="none" stroke="url(#cyberFrame)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 87 28 Q 100 24 113 28" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />

            {/* Subtle Neon Accents at Temples */}
            <circle cx="14" cy="20" r="3" fill="#22D3EE" />
            <circle cx="186" cy="20" r="3" fill="#F43F5E" />
          </svg>
        </div>
      )}

      {/* 3. REALISTIC 3D FLUFFY CAT EARS */}
      {activeSticker === 'cat_ears' && (
        <div
          className="absolute transform -translate-x-1/2 transition-transform duration-75 ease-out"
          style={{
            left: `${centerPercent}%`,
            top: `${headTopPercent}%`,
            width: `${baseWidthPx * 1.05}px`,
            transform: 'translate(-50%, -75%)'
          }}
        >
          <div className="flex items-center justify-between w-full">
            {/* Left Cat Ear */}
            <div className="w-1/3 transform -rotate-12 hover:rotate-[-6deg] transition-transform duration-300">
              <svg viewBox="0 0 70 80" className="w-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
                <defs>
                  <linearGradient id="earFurOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                  <linearGradient id="earFurPink" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FDA4AF" />
                    <stop offset="100%" stopColor="#E11D48" />
                  </linearGradient>
                </defs>
                <path d="M 10 75 Q 5 25 45 5 Q 65 35 55 75 Z" fill="url(#earFurOuter)" stroke="#475569" strokeWidth="3" />
                <path d="M 20 68 Q 18 35 44 18 Q 54 42 46 68 Z" fill="url(#earFurPink)" />
                {/* Fluffy Tuft */}
                <path d="M 18 55 L 26 48 L 22 42 L 32 38" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              </svg>
            </div>

            {/* Right Cat Ear */}
            <div className="w-1/3 transform rotate-12 hover:rotate-[6deg] transition-transform duration-300">
              <svg viewBox="0 0 70 80" className="w-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
                <path d="M 60 75 Q 65 25 25 5 Q 5 35 15 75 Z" fill="url(#earFurOuter)" stroke="#475569" strokeWidth="3" />
                <path d="M 50 68 Q 52 35 26 18 Q 16 42 24 68 Z" fill="url(#earFurPink)" />
                {/* Fluffy Tuft */}
                <path d="M 52 55 L 44 48 L 48 42 L 38 38" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 4. REALISTIC GOLDEN ANGEL HALO */}
      {activeSticker === 'halo' && (
        <div
          className="absolute transform -translate-x-1/2 transition-transform duration-75 ease-out flex flex-col items-center"
          style={{
            left: `${centerPercent}%`,
            top: `${Math.max(4, headTopPercent - 10)}%`,
            width: `${baseWidthPx * 1.08}px`,
            transform: 'translate(-50%, -85%)'
          }}
        >
          {/* Subtle Divine Upward Rays */}
          <div className="w-20 h-14 bg-gradient-to-t from-yellow-300/25 to-transparent blur-md -mb-6" />

          {/* 3D Perspective Elliptical Gold Torus */}
          <svg
            viewBox="0 0 160 60"
            className="w-full drop-shadow-[0_0_25px_rgba(250,204,21,0.9)] animate-pulse"
            style={{ animationDuration: '3s' }}
          >
            <defs>
              <linearGradient id="haloRing" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="30%" stopColor="#FACC15" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>
            </defs>
            {/* Soft Outer Halo Glow */}
            <ellipse cx="80" cy="30" rx="68" ry="18" fill="none" stroke="#FDE047" strokeWidth="8" opacity="0.4" />
            {/* Core Solid Radiant Ring */}
            <ellipse cx="80" cy="30" rx="66" ry="16" fill="none" stroke="url(#haloRing)" strokeWidth="6" />
            {/* Sparkle Glints */}
            <circle cx="28" cy="24" r="2.5" fill="#FFFFFF" />
            <circle cx="132" cy="24" r="2.5" fill="#FFFFFF" />
          </svg>
        </div>
      )}

      {/* 5. ROMANTIC FLOATING 3D HEARTS */}
      {activeSticker === 'hearts' && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
          style={{
            left: `${centerPercent}%`,
            top: `${faceData.y * 100}%`,
            width: `${baseWidthPx * 1.3}px`,
            height: `${baseWidthPx * 1.3}px`
          }}
        >
          <div className="relative w-full h-full">
            <span className="absolute top-2 left-4 text-3xl animate-bounce drop-shadow-[0_0_15px_rgba(244,63,94,0.9)]" style={{ animationDuration: '1.4s' }}>💖</span>
            <span className="absolute top-8 right-2 text-2xl animate-pulse drop-shadow-[0_0_15px_rgba(236,72,153,0.9)]" style={{ animationDuration: '1.1s' }}>💕</span>
            <span className="absolute -bottom-2 left-8 text-2xl animate-bounce drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" style={{ animationDuration: '1.8s' }}>💗</span>
            <span className="absolute bottom-6 right-6 text-3xl animate-pulse drop-shadow-[0_0_15px_rgba(236,72,153,0.9)]" style={{ animationDuration: '1.3s' }}>💓</span>
            <span className="absolute -top-4 right-1/3 text-xl animate-ping" style={{ animationDuration: '2s' }}>✨</span>
          </div>
        </div>
      )}

      {/* 6. CELESTIAL CRYSTAL SPARKLES */}
      {activeSticker === 'sparkles' && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
          style={{
            left: `${centerPercent}%`,
            top: `${faceData.y * 100}%`,
            width: `${baseWidthPx * 1.4}px`,
            height: `${baseWidthPx * 1.4}px`
          }}
        >
          <div className="relative w-full h-full">
            <span className="absolute top-4 left-6 text-2xl text-cyan-300 animate-spin drop-shadow-[0_0_15px_rgba(6,182,212,1)]" style={{ animationDuration: '5s' }}>✦</span>
            <span className="absolute top-2 right-8 text-3xl text-amber-300 animate-pulse drop-shadow-[0_0_18px_rgba(245,158,11,1)]">✨</span>
            <span className="absolute bottom-8 left-4 text-xl text-pink-300 animate-ping" style={{ animationDuration: '2.5s' }}>🌟</span>
            <span className="absolute bottom-4 right-8 text-2xl text-purple-300 animate-spin drop-shadow-[0_0_15px_rgba(168,85,247,1)]" style={{ animationDuration: '6s' }}>✦</span>
            <span className="absolute top-1/2 left-1/4 text-lg text-emerald-300 animate-pulse">✨</span>
          </div>
        </div>
      )}

    </div>
  );
}
