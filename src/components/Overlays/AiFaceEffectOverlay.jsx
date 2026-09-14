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
          // 1. SMART AI HAIR COLOR TINT (Pins accurately above hairline on hair crown)
          // -------------------------------------------------------------
          if (isFacePresent && hasHair) {
            const hrX = mapX(landmarks?.hairRegion?.x || 0.5);
            const hrY = mapY(landmarks?.hairRegion?.y || 0.14);
            const fhY = mapY(landmarks?.forehead?.y || 0.25);
            const hrRx = Math.max(80, (landmarks?.hairRegion?.rx || 0.28) * drawW * 1.5);
            const hrRy = Math.max(70, (landmarks?.hairRegion?.ry || 0.16) * drawH * 1.5);

            ctx.save();
            const hairAlpha = Math.min(0.85, (hairIntensity / 100) * 0.90);

            let hairR = 217, hairG = 70, hairB = 239; // Default Neon Pink
            if (hairTint === 'rose_gold') { hairR = 251; hairG = 113; hairB = 133; }
            else if (hairTint === 'cyan_cyber') { hairR = 6; hairG = 182; hairB = 212; }
            else if (hairTint === 'golden_blonde') { hairR = 250; hairG = 204; hairB = 21; }
            else if (hairTint === 'purple_velvet') { hairR = 168; hairG = 85; hairB = 247; }
            else if (hairTint === 'silver_ash') { hairR = 203; hairG = 213; hairB = 225; }
            else if (hairTint === 'ruby_red') { hairR = 225; hairG = 29; hairB = 72; }

            // Clip region above forehead/hairline so hair color never touches facial skin or eyes
            ctx.beginPath();
            if (face.hairline && face.hairline.length > 3) {
              ctx.moveTo(0, 0);
              ctx.lineTo(dW, 0);
              ctx.lineTo(dW, mapY(face.hairline[face.hairline.length - 1].y));
              for (let i = face.hairline.length - 1; i >= 0; i--) {
                ctx.lineTo(mapX(face.hairline[i].x), mapY(face.hairline[i].y));
              }
              ctx.lineTo(0, mapY(face.hairline[0].y));
              ctx.closePath();
            } else {
              ctx.rect(0, 0, dW, Math.max(0, fhY - 5));
            }
            ctx.clip();

            const hairGrad = ctx.createRadialGradient(hrX, hrY, hrRx * 0.15, hrX, hrY, hrRx);
            hairGrad.addColorStop(0, `rgba(${hairR}, ${hairG}, ${hairB}, ${hairAlpha})`);
            hairGrad.addColorStop(0.5, `rgba(${hairR}, ${hairG}, ${hairB}, ${hairAlpha * 0.8})`);
            hairGrad.addColorStop(1, `rgba(${hairR}, ${hairG}, ${hairB}, 0)`);

            // Use soft-light to color dark hair better than 'color'
            ctx.globalCompositeOperation = 'soft-light';
            ctx.fillStyle = hairGrad;
            ctx.beginPath();
            ctx.ellipse(hrX, hrY, hrRx, hrRy, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Second pass overlay for vibrance
            ctx.globalCompositeOperation = 'overlay';
            ctx.fillStyle = hairGrad;
            ctx.beginPath();
            ctx.ellipse(hrX, hrY, hrRx, hrRy, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }

          // -------------------------------------------------------------
          // 2. SKIN SMOOTHING & PORE-RETOUCH OVERLAY (Clipped to Face Oval)
          // -------------------------------------------------------------
          if (isFacePresent && hasSmoothing) {
            const lcX = mapX(landmarks?.leftCheek?.x || 0.34);
            const rcX = mapX(landmarks?.rightCheek?.x || 0.66);
            const cX = (lcX + rcX) * 0.5;
            const cY = mapY((landmarks?.noseBridge?.y || 0.46));
            const faceRadius = Math.max(35, eyeDistPx * 0.95);

            ctx.save();
            ctx.globalCompositeOperation = 'soft-light';
            ctx.filter = `blur(${Math.max(4, skinSmoothing * 0.18)}px)`;

            if (face.faceOval && face.faceOval.length > 5) {
              ctx.beginPath();
              ctx.moveTo(mapX(face.faceOval[0].x), mapY(face.faceOval[0].y));
              for (let i = 1; i < face.faceOval.length; i++) {
                ctx.lineTo(mapX(face.faceOval[i].x), mapY(face.faceOval[i].y));
              }
              ctx.closePath();
              ctx.clip();
            }

            const skinGlow = ctx.createRadialGradient(cX, cY, faceRadius * 0.2, cX, cY, faceRadius);
            const alpha = Math.min(0.45, skinSmoothing * 0.005);
            skinGlow.addColorStop(0, `rgba(255, 246, 240, ${alpha})`);
            skinGlow.addColorStop(0.65, `rgba(255, 238, 230, ${alpha * 0.6})`);
            skinGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = skinGlow;
            ctx.beginPath();
            ctx.ellipse(cX, cY, faceRadius, faceRadius * 1.25, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // -------------------------------------------------------------
          // 3. SMART AI BLUSH & CHEEK CONTOUR (Positioned on Zygomatic Cheekbones)
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
            ctx.globalCompositeOperation = 'multiply';
            ctx.filter = 'blur(6px)';

            // Left Cheek
            const gL = ctx.createRadialGradient(lcX, lcY, 0, lcX, lcY, cheekR);
            gL.addColorStop(0, `rgba(${blushCol}, ${bAlpha})`);
            gL.addColorStop(0.7, `rgba(${blushCol}, ${bAlpha * 0.5})`);
            gL.addColorStop(1, `rgba(${blushCol}, 0)`);
            ctx.fillStyle = gL;
            ctx.beginPath();
            ctx.ellipse(lcX, lcY, cheekR * 1.1, cheekR * 0.85, 0, 0, Math.PI * 2);
            ctx.fill();

            // Right Cheek
            const gR = ctx.createRadialGradient(rcX, rcY, 0, rcX, rcY, cheekR);
            gR.addColorStop(0, `rgba(${blushCol}, ${bAlpha})`);
            gR.addColorStop(0.7, `rgba(${blushCol}, ${bAlpha * 0.5})`);
            gR.addColorStop(1, `rgba(${blushCol}, 0)`);
            ctx.fillStyle = gR;
            ctx.beginPath();
            ctx.ellipse(rcX, rcY, cheekR * 1.1, cheekR * 0.85, 0, 0, Math.PI * 2);
            ctx.fill();

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

            const irisRadiusL = Math.max(6, (lIris.radius ? lIris.radius * drawW : eyeDistPx * 0.12));
            const irisRadiusR = Math.max(6, (rIris.radius ? rIris.radius * drawW : eyeDistPx * 0.12));

            let lensR = 56, lensG = 189, lensB = 248; // Ice Blue
            if (eyeLens === 'hazel_honey') { lensR = 217; lensG = 119; lensB = 6; }
            else if (eyeLens === 'emerald_green') { lensR = 16; lensG = 185; lensB = 129; }
            else if (eyeLens === 'crystal_gray') { lensR = 148; lensG = 163; lensB = 184; }
            else if (eyeLens === 'violet_dream') { lensR = 168; lensG = 85; lensB = 247; }

            ctx.save();
            [
              { x: leX, y: leY, r: irisRadiusL },
              { x: reX, y: reY, r: irisRadiusR }
            ].forEach(eye => {
              const pupilRadius = eye.r * 0.38;

              // Iris Color Fill (overlay blend mode for realistic texture preservation)
              ctx.globalCompositeOperation = 'overlay';
              
              ctx.beginPath();
              ctx.arc(eye.x, eye.y, eye.r, 0, Math.PI * 2);
              ctx.arc(eye.x, eye.y, pupilRadius, 0, Math.PI * 2, true); // exclude pupil
              ctx.fillStyle = `rgba(${lensR}, ${lensG}, ${lensB}, 0.65)`;
              ctx.fill();
              
              // Add a subtle color blend to ensure the tint is visible
              ctx.globalCompositeOperation = 'color';
              ctx.fillStyle = `rgba(${lensR}, ${lensG}, ${lensB}, 0.35)`;
              ctx.beginPath();
              ctx.arc(eye.x, eye.y, eye.r, 0, Math.PI * 2);
              ctx.arc(eye.x, eye.y, pupilRadius, 0, Math.PI * 2, true);
              ctx.fill();

              // Limbal Ring (outer dark iris boundary)
              ctx.globalCompositeOperation = 'multiply';
              ctx.strokeStyle = `rgba(10, 15, 25, 0.5)`;
              ctx.lineWidth = 1.0;
              ctx.beginPath();
              ctx.arc(eye.x, eye.y, eye.r, 0, Math.PI * 2);
              ctx.stroke();
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

            const faceScale = Math.max(0.65, Math.min(1.8, eyeDistPx / 100));

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (faceSticker === 'crown') {
              const crownSize = Math.round(58 * faceScale);
              ctx.font = `${crownSize}px sans-serif`;
              ctx.shadowColor = 'rgba(234, 179, 8, 0.85)';
              ctx.shadowBlur = 14;
              const bobY = Math.sin(performance.now() * 0.004) * 4;
              // Crown sits comfortably right above the top of the skull
              ctx.fillText('👑', skullX, Math.max(28, skullY - 18 * faceScale + bobY));
            } else if (faceSticker === 'cat_ears') {
              const earSize = Math.round(52 * faceScale);
              ctx.font = `${earSize}px sans-serif`;
              ctx.shadowColor = 'rgba(244, 114, 182, 0.85)';
              ctx.shadowBlur = 12;
              ctx.fillText('🐱', skullX, Math.max(28, skullY - 14 * faceScale));
            } else if (faceSticker === 'sunglasses') {
              const glassesSize = Math.round(66 * faceScale);
              ctx.font = `${glassesSize}px sans-serif`;
              ctx.shadowColor = 'rgba(15, 23, 42, 0.7)';
              ctx.shadowBlur = 10;
              ctx.fillText('🕶️', midEyeX, midEyeY);
            } else if (faceSticker === 'sparkles') {
              const sparkleSize = Math.round(28 * faceScale);
              ctx.font = `${sparkleSize}px sans-serif`;
              ctx.shadowColor = 'rgba(250, 204, 21, 0.85)';
              ctx.shadowBlur = 10;
              const angle = performance.now() * 0.003;
              const radius = eyeDistPx * 0.90;
              const sp1X = noseX + Math.cos(angle) * radius;
              const sp1Y = noseY + Math.sin(angle) * (radius * 0.65);
              const sp2X = noseX + Math.cos(angle + Math.PI) * radius;
              const sp2Y = noseY + Math.sin(angle + Math.PI) * (radius * 0.65);
              ctx.fillText('✨', sp1X, sp1Y);
              ctx.fillText('🌟', sp2X, sp2Y);
            } else if (faceSticker === 'hearts') {
              const heartSize = Math.round(28 * faceScale);
              ctx.font = `${heartSize}px sans-serif`;
              ctx.shadowColor = 'rgba(244, 63, 94, 0.85)';
              ctx.shadowBlur = 10;
              const t = performance.now() * 0.003;
              const lcX = mapX(landmarks.leftCheek?.x || 0.34);
              const lcY = mapY(landmarks.leftCheek?.y || 0.52);
              const rcX = mapX(landmarks.rightCheek?.x || 0.66);
              const rcY = mapY(landmarks.rightCheek?.y || 0.52);
              const h1X = lcX - eyeDistPx * 0.30;
              const h1Y = lcY - Math.abs(Math.sin(t)) * 12;
              const h2X = rcX + eyeDistPx * 0.30;
              const h2Y = rcY - Math.abs(Math.cos(t)) * 12;
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
