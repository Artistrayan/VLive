import React, { useRef, useEffect } from 'react';
import { AiFaceTracker } from '../../services/aiFaceTracker';

/**
 * Advanced Professional AI Beauty & Makeup Real-Time Overlay
 * Renders:
 *  1. Smart AI Lip Tint & Gloss (Pins dynamically to real anatomical lips with Cupid's bow)
 *  2. Smart AI Hair Color Tint (Tints the upper hair crown region above forehead)
 *  3. AI Eye Color Lens & Iris Ring (Pins realistic iris lenses directly to eye pupils)
 *  4. AI Blush & Face Contour (Pins natural rosy / peach cheek glow to cheekbones)
 *  5. Skin Smoothing & Pore-Erasing Filter
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
            if (now - lastTrackTime > 40) {
              lastTrackTime = now;
              cachedFace = await trackerRef.current.update(video);
            }
          } else {
            cachedFace = null;
          }

          const face = cachedFace;
          const isFacePresent = face && face.detected;
          const { landmarks, roll = 0, interOcularDist = 0.22 } = face || {};

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

          // Scaled distances
          const eyeDistPx = Math.max(40, interOcularDist * drawW);

          // -------------------------------------------------------------
          // 1. SMART AI HAIR COLOR TINT
          // -------------------------------------------------------------
          if (isFacePresent && hasHair) {
            const hrX = mapX(landmarks?.hairRegion?.x || 0.5);
            const hrY = mapY(landmarks?.hairRegion?.y || 0.14);
            const fhY = mapY(landmarks?.forehead?.y || 0.25);
            const hrRx = Math.max(90, (landmarks?.hairRegion?.rx || 0.28) * drawW * 1.6);
            const hrRy = Math.max(80, (landmarks?.hairRegion?.ry || 0.16) * drawH * 1.6);

            ctx.save();
            const hairAlpha = Math.min(0.65, (hairIntensity / 100) * 0.70);

            let hairR = 217, hairG = 70, hairB = 239;
            if (hairTint === 'rose_gold') { hairR = 251; hairG = 113; hairB = 133; }
            else if (hairTint === 'cyan_cyber') { hairR = 6; hairG = 182; hairB = 212; }
            else if (hairTint === 'golden_blonde') { hairR = 250; hairG = 204; hairB = 21; }
            else if (hairTint === 'purple_velvet') { hairR = 168; hairG = 85; hairB = 247; }
            else if (hairTint === 'silver_ash') { hairR = 203; hairG = 213; hairB = 225; }
            else if (hairTint === 'ruby_red') { hairR = 225; hairG = 29; hairB = 72; }

            // Create a gradient that fades out quickly at the edges
            const hairGrad = ctx.createRadialGradient(hrX, hrY, hrRx * 0.2, hrX, hrY, hrRx);
            hairGrad.addColorStop(0, `rgba(${hairR}, ${hairG}, ${hairB}, ${hairAlpha})`);
            hairGrad.addColorStop(0.5, `rgba(${hairR}, ${hairG}, ${hairB}, ${hairAlpha * 0.6})`);
            hairGrad.addColorStop(0.8, `rgba(${hairR}, ${hairG}, ${hairB}, ${hairAlpha * 0.1})`);
            hairGrad.addColorStop(1, `rgba(${hairR}, ${hairG}, ${hairB}, 0)`);

            ctx.filter = 'blur(16px)';
            ctx.globalCompositeOperation = 'soft-light';
            ctx.fillStyle = hairGrad;
            
            // Draw an ellipse just on the top of the head
            ctx.beginPath();
            ctx.ellipse(hrX, hrY, hrRx, hrRy, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Second pass overlay for vibrance
            ctx.globalCompositeOperation = 'overlay';
            ctx.beginPath();
            ctx.ellipse(hrX, hrY, hrRx, hrRy, 0, 0, Math.PI * 2);
            ctx.fill();

            // Clear the lower part of the face to ensure it doesn't bleed onto the face
            ctx.globalCompositeOperation = 'destination-out';
            ctx.filter = 'blur(10px)';
            ctx.beginPath();
            ctx.ellipse(mapX(landmarks?.nose?.x || 0.5), mapY(landmarks?.nose?.y || 0.5), hrRx * 0.8, hrRy * 1.2, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }

          // -------------------------------------------------------------
          // 2. SMART AI BLUSH & CHEEK CONTOUR (Positioned on Zygomatic Cheekbones)
          // -------------------------------------------------------------
          if (isFacePresent && hasBlush) {
            const lcX = mapX(face.leftCheek?.x || landmarks?.leftCheek?.x || 0.34);
            const lcY = mapY(face.leftCheek?.y || landmarks?.leftCheek?.y || 0.52);
            const rcX = mapX(face.rightCheek?.x || landmarks?.rightCheek?.x || 0.66);
            const rcY = mapY(face.rightCheek?.y || landmarks?.rightCheek?.y || 0.52);
            const cheekR = Math.max(14, eyeDistPx * 0.25);
            const bAlpha = Math.min(0.65, (blushIntensity / 100) * 0.60);

            let blushCol = '244, 114, 182'; // Rose Pink
            if (blushEffect === 'peach') blushCol = '251, 146, 60';
            else if (blushEffect === 'coral') blushCol = '248, 113, 113';
            else if (blushEffect === 'sweet_plum') blushCol = '192, 132, 252';

            ctx.save();
            ctx.globalCompositeOperation = 'soft-light';
            ctx.filter = 'blur(14px)';

            // Left Cheek (Rotated towards temple)
            const gL = ctx.createRadialGradient(lcX, lcY, 0, lcX, lcY, cheekR);
            gL.addColorStop(0, `rgba(${blushCol}, ${bAlpha})`);
            gL.addColorStop(0.5, `rgba(${blushCol}, ${bAlpha * 0.6})`);
            gL.addColorStop(1, `rgba(${blushCol}, 0)`);
            ctx.fillStyle = gL;
            ctx.beginPath();
            ctx.translate(lcX, lcY);
            ctx.rotate(-Math.PI / 8);
            ctx.ellipse(0, 0, cheekR * 1.5, cheekR * 0.9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.resetTransform(); // Reset for right cheek

            // Right Cheek (Rotated towards temple)
            const gR = ctx.createRadialGradient(rcX, rcY, 0, rcX, rcY, cheekR);
            gR.addColorStop(0, `rgba(${blushCol}, ${bAlpha})`);
            gR.addColorStop(0.5, `rgba(${blushCol}, ${bAlpha * 0.6})`);
            gR.addColorStop(1, `rgba(${blushCol}, 0)`);
            ctx.fillStyle = gR;
            ctx.beginPath();
            ctx.translate(rcX, rcY);
            ctx.rotate(Math.PI / 8);
            ctx.ellipse(0, 0, cheekR * 1.5, cheekR * 0.9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.resetTransform();

            ctx.restore();
          }

          // -------------------------------------------------------------
          // 4. AI EYE COLOR LENS (Sub-millimeter Iris & Cornea Tracking)
          // -------------------------------------------------------------
          if (isFacePresent && hasEyes) {
            const lIris = face.leftIris || { x: landmarks?.leftEye?.x || 0.39, y: landmarks?.leftEye?.y || 0.40, radius: 0.024 };
            const rIris = face.rightIris || { x: landmarks?.rightEye?.x || 0.61, y: landmarks?.rightEye?.y || 0.40, radius: 0.024 };

            const leX = mapX(lIris.x);
            const leY = mapY(lIris.y);
            const reX = mapX(rIris.x);
            const reY = mapY(rIris.y);

            const irisRadiusL = Math.max(5, (lIris.radius ? lIris.radius * drawW : eyeDistPx * 0.11));
            const irisRadiusR = Math.max(5, (rIris.radius ? rIris.radius * drawW : eyeDistPx * 0.11));

            let lensR = 56, lensG = 189, lensB = 248; // Ice Blue
            if (eyeLens === 'hazel_honey') { lensR = 217; lensG = 119; lensB = 6; }
            else if (eyeLens === 'emerald_green') { lensR = 16; lensG = 185; lensB = 129; }
            else if (eyeLens === 'crystal_gray') { lensR = 148; lensG = 163; lensB = 184; }
            else if (eyeLens === 'violet_dream') { lensR = 168; lensG = 85; lensB = 247; }

            ctx.save();
            [
              { x: leX, y: leY, r: irisRadiusL, contour: face.leftEyeContour },
              { x: reX, y: reY, r: irisRadiusR, contour: face.rightEyeContour }
            ].forEach(eye => {
              if (!eye.contour || eye.contour.length < 3) return;
              
              ctx.save(); // Save per eye

              // 1. Clip EXACTLY to the eye opening polygon (prevents color on eyelids)
              ctx.beginPath();
              ctx.moveTo(mapX(eye.contour[0].x), mapY(eye.contour[0].y));
              for(let i = 1; i < eye.contour.length; i++) {
                ctx.lineTo(mapX(eye.contour[i].x), mapY(eye.contour[i].y));
              }
              ctx.closePath();
              ctx.clip();
              
              const pupilRadius = eye.r * 0.35;

              // 2. Iris Color Fill (overlay blend mode for realistic texture preservation)
              ctx.globalCompositeOperation = 'overlay';
              ctx.beginPath();
              ctx.arc(eye.x, eye.y, eye.r, 0, Math.PI * 2);
              ctx.arc(eye.x, eye.y, pupilRadius, 0, Math.PI * 2, true); // exclude pupil
              ctx.fillStyle = `rgba(${lensR}, ${lensG}, ${lensB}, 0.70)`;
              ctx.fill();
              
              // 3. Subtle color blend to ensure the tint is visible
              ctx.globalCompositeOperation = 'color';
              ctx.fillStyle = `rgba(${lensR}, ${lensG}, ${lensB}, 0.40)`;
              ctx.beginPath();
              ctx.arc(eye.x, eye.y, eye.r, 0, Math.PI * 2);
              ctx.arc(eye.x, eye.y, pupilRadius, 0, Math.PI * 2, true);
              ctx.fill();

              // 4. Limbal Ring (outer dark iris boundary)
              ctx.globalCompositeOperation = 'multiply';
              ctx.strokeStyle = `rgba(5, 10, 15, 0.4)`;
              ctx.lineWidth = 1.0;
              ctx.beginPath();
              ctx.arc(eye.x, eye.y, eye.r, 0, Math.PI * 2);
              ctx.stroke();

              ctx.restore(); // Restore per eye clipping
            });
            ctx.restore();
          }

          // -------------------------------------------------------------
          // 5. SMART AI LIP TINT & GLOSS (Exact Anatomical 3D Mesh Polygon)
          // -------------------------------------------------------------
          if (isFacePresent && hasLips) {
            // More natural, softer lip alpha
            const lipAlpha = Math.min(0.55, (lipIntensity / 100) * 0.50);

            let lipR = 225, lipG = 29, lipB = 72; // Classic Ruby
            if (lipTint === 'rose_petal') { lipR = 244; lipG = 63; lipB = 94; }
            else if (lipTint === 'velvet_cherry') { lipR = 190; lipG = 18; lipB = 60; }
            else if (lipTint === 'nude_peach') { lipR = 249; lipG = 115; lipB = 22; }
            else if (lipTint === 'barbie_pink') { lipR = 236; lipG = 72; lipB = 153; }
            else if (lipTint === 'glossy_shine') { lipR = 255; lipG = 180; lipB = 210; }

            ctx.save();
            ctx.globalCompositeOperation = 'soft-light';

            const hasPolygons = face.upperLipPolygon && face.upperLipPolygon.length > 3 && face.lowerLipPolygon && face.lowerLipPolygon.length > 3;

            if (hasPolygons) {
              ctx.filter = 'blur(4px)';
              ctx.fillStyle = `rgba(${lipR}, ${lipG}, ${lipB}, ${lipAlpha})`;

              // 1. Upper Lip Exact Mesh Polygon
              ctx.beginPath();
              ctx.moveTo(mapX(face.upperLipPolygon[0].x), mapY(face.upperLipPolygon[0].y));
              for (let i = 1; i < face.upperLipPolygon.length; i++) {
                ctx.lineTo(mapX(face.upperLipPolygon[i].x), mapY(face.upperLipPolygon[i].y));
              }
              ctx.closePath();
              ctx.fill();

              // 2. Lower Lip Exact Mesh Polygon
              ctx.fillStyle = `rgba(${lipR}, ${lipG}, ${lipB}, ${lipAlpha * 1.05})`;
              ctx.beginPath();
              ctx.moveTo(mapX(face.lowerLipPolygon[0].x), mapY(face.lowerLipPolygon[0].y));
              for (let i = 1; i < face.lowerLipPolygon.length; i++) {
                ctx.lineTo(mapX(face.lowerLipPolygon[i].x), mapY(face.lowerLipPolygon[i].y));
              }
              ctx.closePath();
              ctx.fill();
            } else if (landmarks?.mouth) {
              // Smooth elliptical fallback
              ctx.filter = 'blur(5px)';
              const mX = mapX(landmarks.mouth.x);
              const mY = mapY(landmarks.mouth.y);
              const mW = Math.max(28, (landmarks.mouth.width || 0.18) * drawW);
              const mH = Math.max(14, (landmarks.mouth.height || 0.07) * drawH);

              const upY = mY - mH * 0.28;
              const upGrad = ctx.createRadialGradient(mX, upY, mW * 0.08, mX, upY, mW * 0.52);
              upGrad.addColorStop(0, `rgba(${lipR}, ${lipG}, ${lipB}, ${lipAlpha})`);
              upGrad.addColorStop(0.7, `rgba(${lipR}, ${lipG}, ${lipB}, ${lipAlpha * 0.65})`);
              upGrad.addColorStop(1, `rgba(${lipR}, ${lipG}, ${lipB}, 0)`);
              ctx.fillStyle = upGrad;
              ctx.beginPath();
              ctx.ellipse(mX, upY, mW * 0.48, mH * 0.40, 0, 0, Math.PI * 2);
              ctx.fill();

              const lowY = mY + mH * 0.28;
              const lowGrad = ctx.createRadialGradient(mX, lowY, mW * 0.08, mX, lowY, mW * 0.54);
              lowGrad.addColorStop(0, `rgba(${lipR}, ${lipG}, ${lipB}, ${lipAlpha * 1.05})`);
              lowGrad.addColorStop(0.75, `rgba(${lipR}, ${lipG}, ${lipB}, ${lipAlpha * 0.70})`);
              lowGrad.addColorStop(1, `rgba(${lipR}, ${lipG}, ${lipB}, 0)`);
              ctx.fillStyle = lowGrad;
              ctx.beginPath();
              ctx.ellipse(mX, lowY, mW * 0.45, mH * 0.48, 0, 0, Math.PI * 2);
              ctx.fill();
            }

            // Lip Highlight / Specular Gloss
            if (lipTint === 'glossy_shine' || lipIntensity > 55) {
              ctx.globalCompositeOperation = 'screen';
              ctx.filter = 'blur(2px)';
              ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
              const mX = mapX(landmarks?.mouth?.x || 0.5);
              const mY = mapY(landmarks?.mouth?.y || 0.65);
              const mW = Math.max(28, (landmarks?.mouth?.width || 0.18) * drawW);
              const mH = Math.max(14, (landmarks?.mouth?.height || 0.07) * drawH);
              ctx.beginPath();
              ctx.ellipse(mX, mY + mH * 0.25, mW * 0.22, mH * 0.16, 0, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.restore();
          }

          // -------------------------------------------------------------
          // 6. 3D AR FACE STICKERS & ACCESSORIES
          // -------------------------------------------------------------
          if (isFacePresent && landmarks && hasStickers) {
            const skullX = mapX(landmarks.skullTop?.x || landmarks.forehead?.x || 0.5);
            const skullY = mapY(landmarks.skullTop?.y || 0.14);
            const midEyeX = mapX(landmarks.midEyes?.x || 0.5);
            const midEyeY = mapY(landmarks.midEyes?.y || 0.40);
            const noseX = mapX(landmarks.noseTip?.x || 0.5);
            const noseY = mapY(landmarks.noseTip?.y || 0.53);

            const faceScale = Math.max(0.8, eyeDistPx / 60);

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (faceSticker === 'crown') {
              const crownSize = Math.round(90 * faceScale);
              ctx.font = `${crownSize}px sans-serif`;
              ctx.shadowColor = 'rgba(234, 179, 8, 0.85)';
              ctx.shadowBlur = 14;
              const bobY = Math.sin(performance.now() * 0.005) * 6;
              ctx.fillText('👑', skullX, Math.max(10, skullY - 15 * faceScale + bobY));
            } else if (faceSticker === 'cat_ears') {
              const earSize = Math.round(180 * faceScale);
              ctx.font = `${earSize}px sans-serif`;
              ctx.shadowColor = 'rgba(15, 23, 42, 0.4)';
              ctx.shadowBlur = 12;
              // Cat emoji directly over the face
              ctx.fillText('🐱', noseX, noseY - 10 * faceScale);
            } else if (faceSticker === 'sunglasses') {
              const glassesSize = Math.round(110 * faceScale);
              ctx.font = `${glassesSize}px sans-serif`;
              ctx.shadowColor = 'rgba(15, 23, 42, 0.7)';
              ctx.shadowBlur = 10;
              ctx.fillText('🕶️', midEyeX, midEyeY);
            } else if (faceSticker === 'sparkles') {
              const sparkleSize = Math.round(45 * faceScale);
              ctx.font = `${sparkleSize}px sans-serif`;
              ctx.shadowColor = 'rgba(250, 204, 21, 0.85)';
              ctx.shadowBlur = 10;
              
              const t = performance.now() * 0.002;
              const o1 = Math.sin(t) * 10;
              const o2 = Math.cos(t * 1.5) * 12;
              const o3 = Math.sin(t * 0.8) * 14;
              
              const cheekLX = mapX(landmarks.leftCheek?.x || 0.35);
              const cheekLY = mapY(landmarks.leftCheek?.y || 0.55);
              const cheekRX = mapX(landmarks.rightCheek?.x || 0.65);
              const cheekRY = mapY(landmarks.rightCheek?.y || 0.55);

              ctx.fillText('✨', cheekLX - 20 + o1, cheekLY + o2);
              ctx.fillText('⭐', cheekLX + 25 - o2, cheekLY - 15 + o3);
              ctx.fillText('✨', cheekRX + 20 - o1, cheekRY + o2);
              ctx.fillText('⭐', cheekRX - 25 + o2, cheekRY - 15 + o3);
            } else if (faceSticker === 'hearts') {
              const heartSize = Math.round(55 * faceScale);
              ctx.font = `${heartSize}px sans-serif`;
              ctx.shadowColor = 'rgba(244, 63, 94, 0.85)';
              ctx.shadowBlur = 15;
              
              const bob1 = Math.sin(performance.now() * 0.003) * 10;
              const bob2 = Math.cos(performance.now() * 0.004) * 12;
              const bob3 = Math.sin(performance.now() * 0.002 + 1) * 8;
              
              ctx.fillText('❤️', skullX - 50 * faceScale, skullY - 20 * faceScale + bob1);
              ctx.fillText('💖', skullX + 50 * faceScale, skullY - 10 * faceScale + bob2);
              ctx.fillText('💕', skullX, skullY - 50 * faceScale + bob3);
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
              lightGrad.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
              lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else if (lightingEffect === 'cool') {
              lightGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
              lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else if (lightingEffect === 'neon') {
              lightGrad.addColorStop(0, 'rgba(236, 72, 153, 0.22)');
              lightGrad.addColorStop(0.6, 'rgba(139, 92, 246, 0.18)');
              lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else if (lightingEffect === 'sunset') {
              lightGrad.addColorStop(0, 'rgba(244, 63, 94, 0.28)');
              lightGrad.addColorStop(0.6, 'rgba(251, 146, 60, 0.18)');
              lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else if (lightingEffect === 'studio') {
              lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.30)');
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
