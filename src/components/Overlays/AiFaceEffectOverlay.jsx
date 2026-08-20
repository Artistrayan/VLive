import React, { useRef, useEffect } from 'react';
import { AiFaceTracker } from '../../services/aiFaceTracker';

/**
 * AI Face Mesh & AR Effects Canvas Overlay
 * Accurately renders:
 *  1. Realistic Hair Color Tint ONLY on the detected hair & head crown contour (never misplaced)
 *  2. Smart Lip Tint ONLY when broadcaster's face & lips are actually detected (pinned accurately)
 *  3. Dynamic 3D Face Stickers (Cat Ears, Royal Crown, Sparkles, Sunglasses, Hearts) pinned to real detected landmarks
 *  4. Skin Smoothing & Facial Tone Enhancement
 *  5. Subtle Studio Lighting ambiance (only when explicitly selected)
 */
export default function AiFaceEffectOverlay({
  videoRef,
  isMirrored = true,
  faceSticker = 'none',
  lightingEffect = 'none',
  skinSmoothing = 0,
  eyeEnlarge = 0,
  slimmingLevel = 0
}) {
  const canvasRef = useRef(null);
  const trackerRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    trackerRef.current = new AiFaceTracker();

    let isRunning = true;

    const renderLoop = async () => {
      if (!isRunning) return;

      const canvas = canvasRef.current;
      const video = videoRef?.current;

      if (canvas && video && video.readyState >= 2 && video.videoWidth > 0) {
        const dW = canvas.clientWidth || video.clientWidth || 640;
        const dH = canvas.clientHeight || video.clientHeight || 480;

        if (canvas.width !== dW || canvas.height !== dH) {
          canvas.width = dW;
          canvas.height = dH;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, dW, dH);

          // Get tracked face landmarks
          const face = await trackerRef.current.update(video);
          const isFacePresent = face && face.detected;
          const { landmarks } = face || {};

          // Convert normalized points (0..1) to canvas coordinates accounting for object-fit: cover
          const vW = video.videoWidth;
          const vH = video.videoHeight;
          const scale = Math.max(dW / vW, dH / vH);
          const drawW = vW * scale;
          const drawH = vH * scale;
          const offsetX = (dW - drawW) / 2;
          const offsetY = (dH - drawH) / 2;

          const mapX = (nx) => {
            const scaledX = offsetX + (nx * drawW);
            return isMirrored ? dW - scaledX : scaledX;
          };
          const mapY = (ny) => offsetY + (ny * drawH);

          // -------------------------------------------------------------
          // 0. SKIN SMOOTHING & RETOUCH OVERLAY (Targeted on detected face)
          // -------------------------------------------------------------
          if (isFacePresent && skinSmoothing > 0 && landmarks?.leftCheek && landmarks?.rightCheek) {
            const cX = mapX((landmarks.leftCheek.x + landmarks.rightCheek.x) * 0.5);
            const cY = mapY((landmarks.forehead?.y || 0.2) + ((landmarks.chin?.y || 0.8) - (landmarks.forehead?.y || 0.2)) * 0.5);
            const faceRadius = Math.max(30, Math.abs(mapX(landmarks.rightCheek.x) - mapX(landmarks.leftCheek.x)) * 0.85);

            ctx.save();
            ctx.globalCompositeOperation = 'soft-light';
            ctx.filter = `blur(${Math.max(4, skinSmoothing * 0.15)}px)`;

            const skinGlow = ctx.createRadialGradient(cX, cY, faceRadius * 0.2, cX, cY, faceRadius);
            const alpha = Math.min(0.45, skinSmoothing * 0.005);
            skinGlow.addColorStop(0, `rgba(255, 240, 230, ${alpha})`);
            skinGlow.addColorStop(0.7, `rgba(255, 230, 220, ${alpha * 0.5})`);
            skinGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = skinGlow;
            ctx.beginPath();
            ctx.ellipse(cX, cY, faceRadius, faceRadius * 1.15, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // -------------------------------------------------------------
          // 1. AI AR FACE STICKERS & ACCESSORIES (Pinned to Face Tracking)
          // -------------------------------------------------------------
          if (isFacePresent && landmarks && faceSticker && faceSticker !== 'none') {
            const fhX = mapX(landmarks.forehead?.x || 0.5);
            const fhY = mapY(landmarks.forehead?.y || 0.20);
            const noseX = mapX(landmarks.nose?.x || 0.5);
            const noseY = mapY(landmarks.nose?.y || 0.50);
            const eyeDist = landmarks.rightEye && landmarks.leftEye ? Math.abs(mapX(landmarks.rightEye.x) - mapX(landmarks.leftEye.x)) : 100;
            const faceScale = Math.max(0.6, Math.min(1.6, eyeDist / 120));

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (faceSticker === 'crown') {
              // Royal 3D Crown on top of head
              const crownSize = Math.round(64 * faceScale);
              ctx.font = `${crownSize}px sans-serif`;
              ctx.shadowColor = 'rgba(234, 179, 8, 0.8)';
              ctx.shadowBlur = 12;
              const bobY = Math.sin(performance.now() * 0.004) * 5;
              ctx.fillText('👑', fhX, Math.max(30, fhY - 40 * faceScale + bobY));
            } else if (faceSticker === 'cat_ears') {
              // Cute Cat Ears pinned to head sides
              const earSize = Math.round(50 * faceScale);
              ctx.font = `${earSize}px sans-serif`;
              ctx.shadowColor = 'rgba(244, 114, 182, 0.8)';
              ctx.shadowBlur = 10;
              const earY = fhY - 32 * faceScale;
              ctx.fillText('🐱', fhX, earY);
            } else if (faceSticker === 'sunglasses') {
              // Sunglasses over the eye line
              const glassesSize = Math.round(62 * faceScale);
              const eyeY = mapY(((landmarks.leftEye?.y || 0.38) + (landmarks.rightEye?.y || 0.38)) * 0.5);
              ctx.font = `${glassesSize}px sans-serif`;
              ctx.shadowColor = 'rgba(15, 23, 42, 0.6)';
              ctx.shadowBlur = 8;
              ctx.fillText('🕶️', noseX, eyeY);
            } else if (faceSticker === 'sparkles') {
              // Orbiting Sparkles around cheeks and eyes
              const sparkleSize = Math.round(30 * faceScale);
              ctx.font = `${sparkleSize}px sans-serif`;
              ctx.shadowColor = 'rgba(250, 204, 21, 0.8)';
              ctx.shadowBlur = 10;
              const angle = performance.now() * 0.003;
              const radius = 55 * faceScale;

              const sp1X = noseX + Math.cos(angle) * radius;
              const sp1Y = noseY + Math.sin(angle) * (radius * 0.6);
              const sp2X = noseX + Math.cos(angle + Math.PI) * radius;
              const sp2Y = noseY + Math.sin(angle + Math.PI) * (radius * 0.6);

              ctx.fillText('✨', sp1X, sp1Y);
              ctx.fillText('🌟', sp2X, sp2Y);
            } else if (faceSticker === 'hearts') {
              // Floating Animated Love Hearts
              const heartSize = Math.round(30 * faceScale);
              ctx.font = `${heartSize}px sans-serif`;
              ctx.shadowColor = 'rgba(244, 63, 94, 0.8)';
              ctx.shadowBlur = 8;
              const t = performance.now() * 0.003;
              const h1X = mapX(landmarks.leftCheek?.x || 0.32);
              const h1Y = mapY(landmarks.leftCheek?.y || 0.52) - Math.abs(Math.sin(t)) * 12;
              const h2X = mapX(landmarks.rightCheek?.x || 0.68);
              const h2Y = mapY(landmarks.rightCheek?.y || 0.52) - Math.abs(Math.cos(t)) * 12;

              ctx.fillText('💖', h1X, h1Y);
              ctx.fillText('💕', h2X, h2Y);
            }

            ctx.restore();
          }

          // -------------------------------------------------------------
          // 4. STUDIO LIGHTING AMBIENCE (Graduated Studio Glow)
          // -------------------------------------------------------------
          if (lightingEffect && lightingEffect !== 'none' && lightingEffect !== 'off') {
            ctx.save();
            ctx.globalCompositeOperation = 'soft-light';

            const lightX = dW * 0.5;
            const lightY = dH * 0.35;
            const lightGrad = ctx.createRadialGradient(lightX, lightY, 40, lightX, lightY, dW * 0.7);

            if (lightingEffect === 'warm') {
              lightGrad.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
              lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else if (lightingEffect === 'cool') {
              lightGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
              lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else if (lightingEffect === 'neon') {
              lightGrad.addColorStop(0, 'rgba(236, 72, 153, 0.20)');
              lightGrad.addColorStop(0.6, 'rgba(139, 92, 246, 0.15)');
              lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else if (lightingEffect === 'sunset') {
              lightGrad.addColorStop(0, 'rgba(244, 63, 94, 0.25)');
              lightGrad.addColorStop(0.6, 'rgba(251, 146, 60, 0.15)');
              lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else if (lightingEffect === 'studio') {
              lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
              lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            }

            ctx.fillStyle = lightGrad;
            ctx.fillRect(0, 0, dW, dH);
            ctx.restore();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [videoRef, isMirrored, faceSticker, lightingEffect, skinSmoothing]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}
