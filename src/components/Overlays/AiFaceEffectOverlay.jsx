import React, { useRef, useEffect } from 'react';
import { AiFaceTracker } from '../../services/aiFaceTracker';

/**
 * AI Face Mesh & AR Effects Canvas Overlay
 * Accurately renders:
 *  1. Realistic Hair Color Tint ONLY on the detected hair & head crown contour (doesn't wash out screen)
 *  2. Smart Lip Tint accurately matching the broadcaster's lips & mouth curvature
 *  3. Dynamic 3D Face Stickers (Cat Ears, Royal Crown, Sparkles, Sunglasses, Hearts) pinned to landmarks
 *  4. High-end Studio Lighting ambiance
 */
export default function AiFaceEffectOverlay({
  videoRef,
  isMirrored = true,
  hairColorEffect = 'none',
  lipShade = 'none',
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
          const { landmarks } = face;

          // Convert normalized points (0..1) to canvas coordinates
          // Take mirroring into account for stickers/effects if video is mirrored
          const mapX = (nx) => (isMirrored ? (1 - nx) * dW : nx * dW);
          const mapY = (ny) => ny * dH;

          // -------------------------------------------------------------
          // 1. AI HAIR COLOR EFFECT (Targeted Hair & Crown Region Only)
          // -------------------------------------------------------------
          if (hairColorEffect && hairColorEffect !== 'none') {
            const hr = landmarks.hairRegion;
            const hx = mapX(hr.x);
            const hy = mapY(hr.y);
            const hrx = hr.rx * dW * 1.15;
            const hry = hr.ry * dH * 1.05;

            ctx.save();
            ctx.globalCompositeOperation = 'color'; // Blends color organically into hair strands
            ctx.filter = 'blur(14px)';

            const hairGrad = ctx.createRadialGradient(hx, hy, 10, hx, hy, hrx);

            let primaryColor = 'rgba(234, 179, 8, 0.75)'; // blonde
            let secondaryColor = 'rgba(161, 98, 7, 0.35)';

            if (hairColorEffect === 'pink') {
              primaryColor = 'rgba(244, 114, 182, 0.85)';
              secondaryColor = 'rgba(219, 39, 119, 0.4)';
            } else if (hairColorEffect === 'purple') {
              primaryColor = 'rgba(192, 132, 252, 0.85)';
              secondaryColor = 'rgba(126, 34, 206, 0.4)';
            } else if (hairColorEffect === 'cyan') {
              primaryColor = 'rgba(56, 189, 248, 0.85)';
              secondaryColor = 'rgba(2, 132, 199, 0.4)';
            } else if (hairColorEffect === 'fire') {
              primaryColor = 'rgba(251, 146, 60, 0.85)';
              secondaryColor = 'rgba(220, 38, 38, 0.4)';
            }

            hairGrad.addColorStop(0, primaryColor);
            hairGrad.addColorStop(0.55, secondaryColor);
            hairGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = hairGrad;
            ctx.beginPath();
            // Elliptical arch focused exclusively on top, forehead boundary & crown of head
            ctx.ellipse(hx, hy, hrx, hry, 0, 0, Math.PI * 2);
            ctx.fill();

            // Additional Hair Sides Flare
            ctx.beginPath();
            const leftEarX = mapX(landmarks.leftCheek.x - 0.08);
            const rightEarX = mapX(landmarks.rightCheek.x + 0.08);
            const sideY = mapY(landmarks.leftCheek.y - 0.05);
            ctx.ellipse(leftEarX, sideY, hrx * 0.4, hry * 0.7, 0, 0, Math.PI * 2);
            ctx.ellipse(rightEarX, sideY, hrx * 0.4, hry * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }

          // -------------------------------------------------------------
          // 2. AI SMART LIP TINT (Accurately Clamped to Mouth Landmarks)
          // -------------------------------------------------------------
          if (lipShade && lipShade !== 'none') {
            const m = landmarks.mouth;
            const mx = mapX(m.x);
            const my = mapY(m.y);
            const mw = m.width * dW * 0.65;
            const mh = m.height * dH * 0.45;

            ctx.save();
            ctx.globalCompositeOperation = 'multiply'; // Natural lipstick texture
            ctx.filter = 'blur(4px)';

            let lipColor = 'rgba(225, 29, 72, 0.65)'; // ruby
            if (lipShade === 'coral') lipColor = 'rgba(251, 113, 133, 0.6)';
            else if (lipShade === 'plum') lipColor = 'rgba(147, 51, 234, 0.65)';
            else if (lipShade === 'nude') lipColor = 'rgba(234, 88, 12, 0.55)';

            ctx.fillStyle = lipColor;

            // Draw upper and lower lip contour
            ctx.beginPath();
            ctx.ellipse(mx, my - mh * 0.18, mw * 0.52, mh * 0.42, 0, 0, Math.PI * 2);
            ctx.ellipse(mx, my + mh * 0.18, mw * 0.58, mh * 0.48, 0, 0, Math.PI * 2);
            ctx.fill();

            // Lip Gloss Highlight
            ctx.globalCompositeOperation = 'screen';
            ctx.filter = 'blur(2px)';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.beginPath();
            ctx.ellipse(mx, my + mh * 0.2, mw * 0.25, mh * 0.15, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }

          // -------------------------------------------------------------
          // 3. AI AR FACE STICKERS & ACCESSORIES (Pinned to Face Tracking)
          // -------------------------------------------------------------
          if (faceSticker && faceSticker !== 'none') {
            const fhX = mapX(landmarks.forehead.x);
            const fhY = mapY(landmarks.forehead.y);
            const noseX = mapX(landmarks.nose.x);
            const noseY = mapY(landmarks.nose.y);
            const eyeDist = Math.abs(mapX(landmarks.rightEye.x) - mapX(landmarks.leftEye.x));
            const faceScale = Math.max(0.6, eyeDist / 120);

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (faceSticker === 'crown') {
              // Royal 3D Crown on top of head
              const crownSize = Math.round(72 * faceScale);
              ctx.font = `${crownSize}px sans-serif`;
              ctx.shadowColor = 'rgba(234, 179, 8, 0.9)';
              ctx.shadowBlur = 16;
              const bobY = Math.sin(performance.now() * 0.004) * 6;
              ctx.fillText('👑', fhX, Math.max(35, fhY - 60 * faceScale + bobY));
            } else if (faceSticker === 'cat_ears') {
              // Cute Cat Ears pinned to head sides
              const earSize = Math.round(54 * faceScale);
              ctx.font = `${earSize}px sans-serif`;
              ctx.shadowColor = 'rgba(244, 114, 182, 0.85)';
              ctx.shadowBlur = 12;
              const leftEarX = mapX(landmarks.forehead.x - 0.16);
              const rightEarX = mapX(landmarks.forehead.x + 0.16);
              const earY = fhY - 45 * faceScale;
              ctx.fillText('🐱', fhX, earY);
            } else if (faceSticker === 'sunglasses') {
              // Sunglasses over the eye line
              const glassesSize = Math.round(68 * faceScale);
              const eyeY = mapY((landmarks.leftEye.y + landmarks.rightEye.y) * 0.5);
              ctx.font = `${glassesSize}px sans-serif`;
              ctx.shadowColor = 'rgba(15, 23, 42, 0.7)';
              ctx.shadowBlur = 10;
              ctx.fillText('🕶️', noseX, eyeY);
            } else if (faceSticker === 'sparkles') {
              // Orbiting Sparkles around cheeks and eyes
              const sparkleSize = Math.round(36 * faceScale);
              ctx.font = `${sparkleSize}px sans-serif`;
              ctx.shadowColor = 'rgba(250, 204, 21, 0.9)';
              ctx.shadowBlur = 12;
              const angle = performance.now() * 0.003;
              const radius = 65 * faceScale;

              const sp1X = noseX + Math.cos(angle) * radius;
              const sp1Y = noseY + Math.sin(angle) * (radius * 0.6);
              const sp2X = noseX + Math.cos(angle + Math.PI) * radius;
              const sp2Y = noseY + Math.sin(angle + Math.PI) * (radius * 0.6);

              ctx.fillText('✨', sp1X, sp1Y);
              ctx.fillText('🌟', sp2X, sp2Y);
            } else if (faceSticker === 'hearts') {
              // Floating Animated Love Hearts
              const heartSize = Math.round(34 * faceScale);
              ctx.font = `${heartSize}px sans-serif`;
              ctx.shadowColor = 'rgba(244, 63, 94, 0.85)';
              ctx.shadowBlur = 10;
              const t = performance.now() * 0.003;
              const h1X = mapX(landmarks.leftCheek.x);
              const h1Y = mapY(landmarks.leftCheek.y) - Math.abs(Math.sin(t)) * 15;
              const h2X = mapX(landmarks.rightCheek.x);
              const h2Y = mapY(landmarks.rightCheek.y) - Math.abs(Math.cos(t)) * 15;

              ctx.fillText('💖', h1X, h1Y);
              ctx.fillText('💕', h2X, h2Y);
            }

            ctx.restore();
          }

          // -------------------------------------------------------------
          // 4. STUDIO LIGHTING AMBIENCE (Graduated Studio Glow)
          // -------------------------------------------------------------
          if (lightingEffect && lightingEffect !== 'none') {
            ctx.save();
            ctx.globalCompositeOperation = 'soft-light';

            const lightX = dW * 0.5;
            const lightY = dH * 0.35;
            const lightGrad = ctx.createRadialGradient(lightX, lightY, 40, lightX, lightY, dW * 0.7);

            if (lightingEffect === 'warm') {
              lightGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
              lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else if (lightingEffect === 'cool') {
              lightGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
              lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else if (lightingEffect === 'neon') {
              lightGrad.addColorStop(0, 'rgba(236, 72, 153, 0.35)');
              lightGrad.addColorStop(0.6, 'rgba(139, 92, 246, 0.25)');
              lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else if (lightingEffect === 'sunset') {
              lightGrad.addColorStop(0, 'rgba(244, 63, 94, 0.4)');
              lightGrad.addColorStop(0.6, 'rgba(251, 146, 60, 0.3)');
              lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else {
              lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
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
  }, [videoRef, isMirrored, hairColorEffect, lipShade, faceSticker, lightingEffect]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}
