import React, { useRef, useEffect } from 'react';
import { AiFaceTracker } from '../../services/aiFaceTracker';

/**
 * Advanced Professional AI Beauty & Makeup Real-Time Overlay
 * Renders:
 *  1. Smart AI Lip Tint & Gloss (Pins dynamically to detected upper and lower lip contour)
 *  2. Smart AI Hair Color Tint (Tints the upper hair crown region with natural blend)
 *  3. AI Eye Color Lens & Eye Enlarge (Pins color iris lens to left and right eye centers)
 *  4. AI Blush & Face Contour (Pins natural rosy / peach cheek glow to cheekbones)
 *  5. Skin Smoothing & Tone Retouch (Selective pore-erasing soft lighting)
 *  6. 3D AR Face Stickers (Crown, Cat Ears, Sunglasses, Sparkles, Hearts)
 *  7. Studio Lighting mood filter
 */
export default function AiFaceEffectOverlay({
  videoRef,
  isMirrored = false,
  faceSticker = 'none',
  lightingEffect = 'none',
  skinSmoothing = 50,
  lipTint = 'none',
  lipIntensity = 60,
  hairTint = 'none',
  hairIntensity = 50,
  eyeLens = 'none',
  blushEffect = 'none',
  blushIntensity = 40
}) {
  const canvasRef = useRef(null);
  const trackerRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    trackerRef.current = new AiFaceTracker();
    let isRunning = true;
    let lastTrackTime = 0;
    let cachedFace = null;

    const renderLoop = async () => {
      if (!isRunning) return;

      const canvas = canvasRef.current;
      const video = videoRef?.current;

      const hasStickers = faceSticker && faceSticker !== 'none';
      const hasSmoothing = skinSmoothing > 0;
      const hasLighting = lightingEffect && lightingEffect !== 'none' && lightingEffect !== 'off';
      const hasLips = lipTint && lipTint !== 'none';
      const hasHair = hairTint && hairTint !== 'none';
      const hasEyes = eyeLens && eyeLens !== 'none';
      const hasBlush = blushEffect && blushEffect !== 'none';

      if (!hasStickers && !hasSmoothing && !hasLighting && !hasLips && !hasHair && !hasEyes && !hasBlush) {
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        animFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      if (canvas && video && video.readyState >= 2 && video.videoWidth > 0) {
        const dW = canvas.clientWidth || video.clientWidth || 360;
        const dH = canvas.clientHeight || video.clientHeight || 640;

        if (canvas.width !== dW || canvas.height !== dH) {
          canvas.width = dW;
          canvas.height = dH;
        }

        const ctx = canvas.getContext('2d', { alpha: true });
        if (ctx) {
          ctx.clearRect(0, 0, dW, dH);

          const now = performance.now();
          if (trackerRef.current) {
            if (now - lastTrackTime > 60) {
              lastTrackTime = now;
              cachedFace = await trackerRef.current.update(video);
            }
          } else {
            cachedFace = null;
          }

          const face = cachedFace;
          const isFacePresent = face && face.detected;
          const { landmarks } = face || {};

          // Coordinate Mapping for video object-fit: cover
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
          // 1. SMART AI HAIR COLOR TINT (Pins accurately above forehead & crown)
          // -------------------------------------------------------------
          if (isFacePresent && hasHair && landmarks?.hairRegion) {
            const hrX = mapX(landmarks.hairRegion.x);
            const hrY = mapY(landmarks.hairRegion.y);
            const hrRx = landmarks.hairRegion.rx * drawW;
            const hrRy = landmarks.hairRegion.ry * drawH;

            ctx.save();
            ctx.globalCompositeOperation = 'color';
            const hairAlpha = Math.min(0.7, (hairIntensity / 100) * 0.65);

            let hairR = 217, hairG = 70, hairB = 239; // Default Neon Pink
            if (hairTint === 'rose_gold') { hairR = 251; hairG = 113; hairB = 133; }
            else if (hairTint === 'cyan_cyber') { hairR = 6; hairG = 182; hairB = 212; }
            else if (hairTint === 'golden_blonde') { hairR = 250; hairG = 204; hairB = 21; }
            else if (hairTint === 'purple_velvet') { hairR = 168; hairG = 85; hairB = 247; }
            else if (hairTint === 'silver_ash') { hairR = 203; hairG = 213; hairB = 225; }
            else if (hairTint === 'ruby_red') { hairR = 225; hairG = 29; hairB = 72; }

            const hairGrad = ctx.createRadialGradient(hrX, hrY, hrRx * 0.2, hrX, hrY, hrRx);
            hairGrad.addColorStop(0, `rgba(${hairR}, ${hairG}, ${hairB}, ${hairAlpha})`);
            hairGrad.addColorStop(0.6, `rgba(${hairR}, ${hairG}, ${hairB}, ${hairAlpha * 0.7})`);
            hairGrad.addColorStop(1, `rgba(${hairR}, ${hairG}, ${hairB}, 0)`);

            ctx.fillStyle = hairGrad;
            ctx.beginPath();
            ctx.ellipse(hrX, hrY, hrRx, hrRy, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // -------------------------------------------------------------
          // 2. SKIN SMOOTHING & PORE-RETOUCH OVERLAY
          // -------------------------------------------------------------
          if (isFacePresent && hasSmoothing && landmarks?.leftCheek && landmarks?.rightCheek) {
            const cX = mapX((landmarks.leftCheek.x + landmarks.rightCheek.x) * 0.5);
            const cY = mapY((landmarks.forehead?.y || 0.2) + ((landmarks.chin?.y || 0.8) - (landmarks.forehead?.y || 0.2)) * 0.5);
            const faceRadius = Math.max(30, Math.abs(mapX(landmarks.rightCheek.x) - mapX(landmarks.leftCheek.x)) * 0.88);

            ctx.save();
            ctx.globalCompositeOperation = 'soft-light';
            ctx.filter = `blur(${Math.max(4, skinSmoothing * 0.16)}px)`;
            const skinGlow = ctx.createRadialGradient(cX, cY, faceRadius * 0.15, cX, cY, faceRadius);
            const alpha = Math.min(0.5, skinSmoothing * 0.0055);
            skinGlow.addColorStop(0, `rgba(255, 245, 238, ${alpha})`);
            skinGlow.addColorStop(0.6, `rgba(255, 235, 225, ${alpha * 0.6})`);
            skinGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = skinGlow;
            ctx.beginPath();
            ctx.ellipse(cX, cY, faceRadius, faceRadius * 1.18, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // -------------------------------------------------------------
          // 3. SMART AI BLUSH & CHEEK CONTOUR
          // -------------------------------------------------------------
          if (isFacePresent && hasBlush && landmarks?.leftCheek && landmarks?.rightCheek) {
            const lcX = mapX(landmarks.leftCheek.x);
            const lcY = mapY(landmarks.leftCheek.y);
            const rcX = mapX(landmarks.rightCheek.x);
            const rcY = mapY(landmarks.rightCheek.y);
            const cheekR = Math.max(16, Math.abs(rcX - lcX) * 0.22);
            const bAlpha = Math.min(0.65, (blushIntensity / 100) * 0.6);

            let blushCol = '244, 114, 182'; // Rose Pink
            if (blushEffect === 'peach') blushCol = '251, 146, 60';
            else if (blushEffect === 'coral') blushCol = '248, 113, 113';
            else if (blushEffect === 'sweet_plum') blushCol = '192, 132, 252';

            ctx.save();
            ctx.globalCompositeOperation = 'multiply';
            ctx.filter = 'blur(6px)';

            // Left Cheek
            const gL = ctx.createRadialGradient(lcX, lcY, 0, lcX, lcY, cheekR);
            gL.addColorStop(0, `rgba(${blushCol}, ${bAlpha})`);
            gL.addColorStop(1, `rgba(${blushCol}, 0)`);
            ctx.fillStyle = gL;
            ctx.beginPath();
            ctx.arc(lcX, lcY, cheekR, 0, Math.PI * 2);
            ctx.fill();

            // Right Cheek
            const gR = ctx.createRadialGradient(rcX, rcY, 0, rcX, rcY, cheekR);
            gR.addColorStop(0, `rgba(${blushCol}, ${bAlpha})`);
            gR.addColorStop(1, `rgba(${blushCol}, 0)`);
            ctx.fillStyle = gR;
            ctx.beginPath();
            ctx.arc(rcX, rcY, cheekR, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }

          // -------------------------------------------------------------
          // 4. AI EYE COLOR LENS (Pins perfectly to left & right eye pupils)
          // -------------------------------------------------------------
          if (isFacePresent && hasEyes && landmarks?.leftEye && landmarks?.rightEye) {
            const leX = mapX(landmarks.leftEye.x);
            const leY = mapY(landmarks.leftEye.y);
            const reX = mapX(landmarks.rightEye.x);
            const reY = mapY(landmarks.rightEye.y);
            const eyeDist = Math.abs(reX - leX);
            const pupilR = Math.max(5, eyeDist * 0.08);

            let lensR = 56, lensG = 189, lensB = 248; // Ice Blue
            if (eyeLens === 'hazel_honey') { lensR = 217; lensG = 119; lensB = 6; }
            else if (eyeLens === 'emerald_green') { lensR = 16; lensG = 185; lensB = 129; }
            else if (eyeLens === 'crystal_gray') { lensR = 148; lensG = 163; lensB = 184; }
            else if (eyeLens === 'violet_dream') { lensR = 168; lensG = 85; lensB = 247; }

            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            [ { x: leX, y: leY }, { x: reX, y: reY } ].forEach(eye => {
              const eyeGlow = ctx.createRadialGradient(eye.x, eye.y, pupilR * 0.2, eye.x, eye.y, pupilR);
              eyeGlow.addColorStop(0, `rgba(${lensR}, ${lensG}, ${lensB}, 0.8)`);
              eyeGlow.addColorStop(0.7, `rgba(${lensR}, ${lensG}, ${lensB}, 0.4)`);
              eyeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
              ctx.fillStyle = eyeGlow;
              ctx.beginPath();
              ctx.arc(eye.x, eye.y, pupilR, 0, Math.PI * 2);
              ctx.fill();

              // Tiny iris highlight
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.beginPath();
              ctx.arc(eye.x - pupilR * 0.3, eye.y - pupilR * 0.3, pupilR * 0.25, 0, Math.PI * 2);
              ctx.fill();
            });
            ctx.restore();
          }

          // -------------------------------------------------------------
          // 5. SMART AI LIP TINT & GLOSS (Pins dynamically to real mouth contour)
          // -------------------------------------------------------------
          if (isFacePresent && hasLips && landmarks?.mouth) {
            const mX = mapX(landmarks.mouth.x);
            const mY = mapY(landmarks.mouth.y);
            const mW = (landmarks.mouth.width || 0.28) * drawW;
            const mH = (landmarks.mouth.height || 0.10) * drawH;
            const lipAlpha = Math.min(0.75, (lipIntensity / 100) * 0.7);

            let lipR = 225, lipG = 29, lipB = 72; // Classic Ruby
            if (lipTint === 'rose_petal') { lipR = 244; lipG = 63; lipB = 94; }
            else if (lipTint === 'velvet_cherry') { lipR = 190; lipG = 18; lipB = 60; }
            else if (lipTint === 'nude_peach') { lipR = 249; lipG = 115; lipB = 22; }
            else if (lipTint === 'barbie_pink') { lipR = 236; lipG = 72; lipB = 153; }
            else if (lipTint === 'glossy_shine') { lipR = 255; lipG = 200; lipB = 220; }

            ctx.save();
            ctx.globalCompositeOperation = 'multiply';
            ctx.filter = 'blur(2px)';

            // Upper Lip & Lower Lip Shape Contouring
            const lipGrad = ctx.createRadialGradient(mX, mY, mW * 0.1, mX, mY, mW * 0.5);
            lipGrad.addColorStop(0, `rgba(${lipR}, ${lipG}, ${lipB}, ${lipAlpha})`);
            lipGrad.addColorStop(0.7, `rgba(${lipR}, ${lipG}, ${lipB}, ${lipAlpha * 0.65})`);
            lipGrad.addColorStop(1, `rgba(${lipR}, ${lipG}, ${lipB}, 0)`);

            ctx.fillStyle = lipGrad;
            ctx.beginPath();
            ctx.ellipse(mX, mY, mW * 0.46, mH * 0.44, 0, 0, Math.PI * 2);
            ctx.fill();

            // Lip Highlight / Gloss
            if (lipTint === 'glossy_shine' || lipIntensity > 60) {
              ctx.globalCompositeOperation = 'screen';
              ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
              ctx.beginPath();
              ctx.ellipse(mX, mY + mH * 0.12, mW * 0.22, mH * 0.15, 0, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.restore();
          }

          // -------------------------------------------------------------
          // 6. 3D AR FACE STICKERS & ACCESSORIES
          // -------------------------------------------------------------
          if (isFacePresent && landmarks && hasStickers) {
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
              const crownSize = Math.round(64 * faceScale);
              ctx.font = `${crownSize}px sans-serif`;
              ctx.shadowColor = 'rgba(234, 179, 8, 0.8)';
              ctx.shadowBlur = 12;
              const bobY = Math.sin(performance.now() * 0.004) * 5;
              ctx.fillText('👑', fhX, Math.max(30, fhY - 40 * faceScale + bobY));
            } else if (faceSticker === 'cat_ears') {
              const earSize = Math.round(50 * faceScale);
              ctx.font = `${earSize}px sans-serif`;
              ctx.shadowColor = 'rgba(244, 114, 182, 0.8)';
              ctx.shadowBlur = 10;
              const earY = fhY - 32 * faceScale;
              ctx.fillText('🐱', fhX, earY);
            } else if (faceSticker === 'sunglasses') {
              const glassesSize = Math.round(62 * faceScale);
              const eyeY = mapY(((landmarks.leftEye?.y || 0.38) + (landmarks.rightEye?.y || 0.38)) * 0.5);
              ctx.font = `${glassesSize}px sans-serif`;
              ctx.shadowColor = 'rgba(15, 23, 42, 0.6)';
              ctx.shadowBlur = 8;
              ctx.fillText('🕶️', noseX, eyeY);
            } else if (faceSticker === 'sparkles') {
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
          // 7. STUDIO LIGHTING AMBIENCE
          // -------------------------------------------------------------
          if (hasLighting) {
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
  }, [
    videoRef,
    isMirrored,
    faceSticker,
    lightingEffect,
    skinSmoothing,
    lipTint,
    lipIntensity,
    hairTint,
    hairIntensity,
    eyeLens,
    blushEffect,
    blushIntensity
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}
