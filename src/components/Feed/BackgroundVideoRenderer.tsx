import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Shloka, AmbientAtmosphereType, UserPreferences } from '../../types';
import { Download, Check, X, Maximize2, Loader2 } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { setupSpiritualAtmosphereAudio, SpiritualAudioController } from '../../utils/spiritualAudio';
import { convertWebmToMp4, downloadFile } from '../../utils/videoConversion';

interface BackgroundVideoRendererProps {
  shloka: Shloka | null;
  preferences?: UserPreferences;
  isLight?: boolean;
  onClearShloka: () => void;
  onOpenDetailedModal?: () => void;
}

export const BackgroundVideoRenderer: React.FC<BackgroundVideoRendererProps> = ({
  shloka,
  preferences,
  isLight = false,
  onClearShloka,
  onOpenDetailedModal,
}) => {
  const [isRendering, setIsRendering] = useState(false);
  const [isEncodingMp4, setIsEncodingMp4] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [downloadCompleted, setDownloadCompleted] = useState(false);
  const [savedBlobUrl, setSavedBlobUrl] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const audioControllerRef = useRef<SpiritualAudioController | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const currentShlokaRef = useRef<Shloka | null>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (savedBlobUrl) {
        URL.revokeObjectURL(savedBlobUrl);
      }
    };
  }, []);

  // 1. Helper: Draw Official Google Play Store Vector Logo with authentic 4-color faceted geometry
  const drawOfficialGooglePlayLogo = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);

    const w = size;
    const h = size * 1.12;

    const cx = w * 0.52;
    const cy = h * 0.5;
    const tx = w * 0.62;
    const ty = h * 0.32;
    const bx = w * 0.62;
    const by = h * 0.68;
    const ax = w * 0.96;
    const ay = h * 0.5;

    // Blue (Top segment)
    ctx.beginPath();
    ctx.moveTo(w * 0.05, h * 0.04);
    ctx.lineTo(tx, ty);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    const blueGrad = ctx.createLinearGradient(0, 0, tx, ty);
    blueGrad.addColorStop(0, '#00C3FF');
    blueGrad.addColorStop(1, '#0077F7');
    ctx.fillStyle = blueGrad;
    ctx.fill();

    // Green (Right apex segment)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tx, ty);
    ctx.lineTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.closePath();
    const greenGrad = ctx.createLinearGradient(cx, ty, ax, ay);
    greenGrad.addColorStop(0, '#00E676');
    greenGrad.addColorStop(1, '#00C853');
    ctx.fillStyle = greenGrad;
    ctx.fill();

    // Yellow (Bottom segment)
    ctx.beginPath();
    ctx.moveTo(w * 0.05, h * 0.96);
    ctx.lineTo(bx, by);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    const yellowGrad = ctx.createLinearGradient(0, h, bx, by);
    yellowGrad.addColorStop(0, '#FFD200');
    yellowGrad.addColorStop(1, '#FFA000');
    ctx.fillStyle = yellowGrad;
    ctx.fill();

    // Red (Left segment)
    ctx.beginPath();
    ctx.moveTo(w * 0.05, h * 0.04);
    ctx.lineTo(cx, cy);
    ctx.lineTo(w * 0.05, h * 0.96);
    ctx.closePath();
    const redGrad = ctx.createLinearGradient(0, 0, cx, cy);
    redGrad.addColorStop(0, '#FF3A44');
    redGrad.addColorStop(1, '#EA4335');
    ctx.fillStyle = redGrad;
    ctx.fill();

    ctx.restore();
  };

  // 2. Helper: Draw GeetaFlow Official Sacred Chariot Emblem (दिव्य रथ) on canvas
  const drawGeetaFlowOriginalLogo = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);

    const rad = size * 0.28;
    ctx.save();
    ctx.shadowColor = 'rgba(217, 119, 6, 0.4)';
    ctx.shadowBlur = 8;
    const borderGrad = ctx.createLinearGradient(0, 0, size, size);
    borderGrad.addColorStop(0, '#fbbf24');
    borderGrad.addColorStop(0.5, '#d97706');
    borderGrad.addColorStop(1, '#78350f');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 2;
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, rad);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Inner subtle golden radiating glow
    const innerAura = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
    innerAura.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
    innerAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = innerAura;
    ctx.beginPath();
    ctx.roundRect(2, 2, size - 4, size - 4, rad - 2);
    ctx.fill();

    // Sacred Chariot vector
    ctx.save();
    const s = size / 24;
    ctx.scale(s, s);

    // Chariot Body
    ctx.beginPath();
    ctx.moveTo(3.5, 15.5);
    ctx.lineTo(14.5, 15.5);
    ctx.lineTo(12.9, 11);
    ctx.lineTo(5.1, 11);
    ctx.closePath();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Chariot Canopy Arc
    ctx.beginPath();
    ctx.moveTo(3.5, 15.5);
    ctx.quadraticCurveTo(2.3, 10.5, 4.7, 8.5);
    ctx.quadraticCurveTo(6.5, 7, 9.9, 7.7);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Flagstaff & Kapidhwaja Banner
    ctx.beginPath();
    ctx.moveTo(5.2, 8);
    ctx.lineTo(5.2, 2);
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(5.2, 2.5);
    ctx.quadraticCurveTo(7.8, 2.9, 9.4, 4.1);
    ctx.quadraticCurveTo(7.4, 5.1, 5.2, 4);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 0.9;
    ctx.stroke();

    // Flag finial
    ctx.beginPath();
    ctx.arc(5.2, 1.8, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.fill();

    // Sri Krishna (Charioteer) with Divine Plume
    ctx.beginPath();
    ctx.arc(12, 9.2, 1.3, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Peacock Feather Plume
    ctx.beginPath();
    ctx.moveTo(12.3, 8);
    ctx.quadraticCurveTo(13.1, 7.1, 13.8, 7.3);
    ctx.quadraticCurveTo(13.6, 7.9, 12.5, 9);
    ctx.fillStyle = '#10b981';
    ctx.fill();

    // Arjuna in reverence
    ctx.beginPath();
    ctx.arc(8, 10.2, 1.1, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    // Spoked Chariot Wheel (Dharma Chakra)
    ctx.beginPath();
    ctx.arc(10, 17.8, 3.4, 0, Math.PI * 2);
    ctx.fillStyle = '#1c1917';
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(10, 17.8, 1, 0, Math.PI * 2);
    ctx.fillStyle = '#fde047';
    ctx.fill();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(10, 14.4); ctx.lineTo(10, 21.2);
    ctx.moveTo(6.6, 17.8); ctx.lineTo(13.4, 17.8);
    ctx.moveTo(7.6, 15.4); ctx.lineTo(12.4, 20.2);
    ctx.moveTo(7.6, 20.2); ctx.lineTo(12.4, 15.4);
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  };

  // 3. Helper: Traditional Indian Temple / Royal Manuscript Corner Ornaments
  const drawCornerFiligree = (ctx: CanvasRenderingContext2D, x: number, y: number, len: number, flipX: boolean, flipY: boolean) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

    ctx.strokeStyle = 'rgba(217, 119, 6, 0.45)';
    ctx.lineWidth = 1.6;

    // L-Bracket
    ctx.beginPath();
    ctx.moveTo(0, len);
    ctx.lineTo(0, 0);
    ctx.lineTo(len, 0);
    ctx.stroke();

    // Inner arc
    ctx.beginPath();
    ctx.arc(0, 0, len * 0.45, 0, Math.PI / 2);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Golden bead
    ctx.beginPath();
    ctx.arc(7, 7, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#d97706';
    ctx.fill();

    ctx.restore();
  };

  // 4. Helper: Draw Rotating Kurukshetra Chariot (दिव्य रथ) in background behind text
  const drawRotatingChariotBackground = (
    ctx: CanvasRenderingContext2D, 
    cx: number, 
    cy: number, 
    radius: number, 
    time: number
  ) => {
    ctx.save();
    ctx.translate(cx, cy);

    const rotSpeed = 0.0006;
    const angle = (time * rotSpeed) % (Math.PI * 2);
    ctx.rotate(angle);

    ctx.strokeStyle = 'rgba(217, 119, 6, 0.2)';
    ctx.fillStyle = 'rgba(245, 158, 11, 0.04)';
    ctx.lineWidth = 2;

    // Outer sacred concentric rings
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.16)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 16 Radiating Sacred Spokes of Dharma Chakra
    const spokeCount = 16;
    for (let i = 0; i < spokeCount; i++) {
      const spokeAngle = (i * Math.PI * 2) / spokeCount;
      const x2 = Math.cos(spokeAngle) * radius * 0.85;
      const y2 = Math.sin(spokeAngle) * radius * 0.85;
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(217, 119, 6, 0.22)' : 'rgba(245, 158, 11, 0.14)';
      ctx.lineWidth = i % 4 === 0 ? 2.5 : 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x2, y2, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(217, 119, 6, 0.28)';
      ctx.fill();
    }

    // Central Golden Hub
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(254, 243, 199, 0.85)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(217, 119, 6, 0.6)';
    ctx.fill();

    // Sacred Chariot & Flag overlay
    ctx.save();
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.32)';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(-radius * 0.5, -15);
    ctx.lineTo(radius * 0.5, -15);
    ctx.lineTo(radius * 0.4, -radius * 0.38);
    ctx.lineTo(-radius * 0.4, -radius * 0.38);
    ctx.closePath();
    ctx.fillStyle = 'rgba(254, 243, 199, 0.4)';
    ctx.fill();
    ctx.stroke();

    // Flagstaff & Banner
    ctx.beginPath();
    ctx.moveTo(-radius * 0.35, -radius * 0.38);
    ctx.lineTo(-radius * 0.35, -radius * 0.82);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-radius * 0.35, -radius * 0.82);
    ctx.quadraticCurveTo(-radius * 0.1, -radius * 0.72, -radius * 0.35, -radius * 0.6);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.fill();
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  };

  const stopAudioAndRecording = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioControllerRef.current) {
      try { audioControllerRef.current.stop(); } catch {}
      audioControllerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch {}
    }

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
  }, []);

  // Background Rendering Core Routine
  const startBackgroundRendering = useCallback((targetShloka: Shloka) => {
    stopAudioAndRecording();
    currentShlokaRef.current = targetShloka;
    setIsRendering(true);
    setIsEncodingMp4(false);
    setProgress(0);
    setElapsedSeconds(0);
    setDownloadCompleted(false);
    chunksRef.current = [];

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 9:16 Vertical Reel Format (720x1280)
    canvas.width = 720;
    canvas.height = 1280;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup Spiritual Web Audio
    let audioStream: MediaStream | null = null;
    if (typeof window !== 'undefined') {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioCtxRef.current = audioCtx;
        const destination = audioCtx.createMediaStreamDestination();
        audioDestinationRef.current = destination;

        audioControllerRef.current = setupSpiritualAtmosphereAudio(audioCtx, destination, 'temple_bells', 30);
        audioStream = destination.stream;
      } catch (err) {
        console.warn('Background Audio setup warning:', err);
      }
    }

    // Capture Canvas stream at 30 fps
    const canvasStream = canvas.captureStream(30);
    const combinedTracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];
    if (audioStream) {
      combinedTracks.push(...audioStream.getAudioTracks());
    }
    const combinedStream = new MediaStream(combinedTracks);

    // Setup MediaRecorder
    let mimeType = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/mp4';
    }

    try {
      const recorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
        videoBitsPerSecond: 3500000,
      });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const rawBlob = new Blob(chunksRef.current, { type: mimeType });
        const webmUrl = URL.createObjectURL(rawBlob);
        setSavedBlobUrl(webmUrl);
        setIsRendering(false);
        setIsEncodingMp4(true);
        triggerHaptic('success');

        const filename = `GeetaFlow_Gita_Ch${targetShloka.chapter}_Verse${targetShloka.verse}_Reel.mp4`;

        try {
          // Convert to certified MP4 (H.264 High Profile, AAC, Faststart) via server ffmpeg
          const mp4Blob = await convertWebmToMp4(rawBlob, filename);
          downloadFile(mp4Blob, filename);
          setDownloadCompleted(true);
          setSuccessToast(`गीता अध्याय ${targetShloka.chapter}, श्लोक ${targetShloka.verse} MP4 रील डाउनलोड हो गई है! (Instagram & YouTube Shorts Ready)`);
        } catch (encodeErr) {
          console.warn('Background MP4 encoding fallback:', encodeErr);
          downloadFile(rawBlob, filename);
          setDownloadCompleted(true);
          setSuccessToast(`गीता अध्याय ${targetShloka.chapter}, श्लोक ${targetShloka.verse} वीडियो रील डाउनलोड हो गई है!`);
        } finally {
          setIsEncodingMp4(false);
          setTimeout(() => {
            setSuccessToast(null);
            onClearShloka();
          }, 4500);
        }
      };

      recorder.start(100);
    } catch (e) {
      console.warn('Background MediaRecorder error:', e);
    }

    // 30-Second Light Mode Reel Rendering Loop
    const targetDuration = 30;
    const durationMs = targetDuration * 1000;
    const startTime = performance.now();

    const particles = Array.from({ length: 36 }, () => ({
      x: Math.random() * 720,
      y: Math.random() * 1280,
      radius: Math.random() * 2.5 + 1.2,
      vy: -Math.random() * 0.45 - 0.2,
      vx: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.45 + 0.15,
      phase: Math.random() * Math.PI * 2,
    }));

    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number = 3) => {
      const words = text.split(' ');
      let line = '';
      let lineCount = 0;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
          lineCount++;
          if (lineCount >= maxLines - 1 && n < words.length - 1) {
            line = line.trim() + '...';
            break;
          }
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
      return y + lineHeight;
    };

    const userNameDisplay = preferences?.userName?.trim() || 'साधक';

    const render = (time: number) => {
      const elapsed = time - startTime;
      const currentProgress = Math.min(1.0, elapsed / durationMs);
      const curSecs = Math.min(targetDuration, Math.floor(elapsed / 1000));
      setElapsedSeconds(curSecs);
      setProgress(Math.round(currentProgress * 100));

      const width = 720;
      const height = 1280;

      ctx.clearRect(0, 0, width, height);

      // A. Meditative Light Spiritual Canvas (Multi-stop Ivory/Parchment Gradient)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#fffefb');
      bgGrad.addColorStop(0.25, '#fefbf3');
      bgGrad.addColorStop(0.7, '#fef8ea');
      bgGrad.addColorStop(1, '#faf0d7');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Sacred Golden Hairline Dual Borders
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(16, 16, width - 32, height - 32);

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
      ctx.lineWidth = 1;
      ctx.strokeRect(22, 22, width - 44, height - 44);

      // Traditional Indian Temple Corner Filigrees
      drawCornerFiligree(ctx, 28, 28, 38, false, false);
      drawCornerFiligree(ctx, width - 28, 28, 38, true, false);
      drawCornerFiligree(ctx, 28, height - 28, 38, false, true);
      drawCornerFiligree(ctx, width - 28, height - 28, 38, true, true);

      // B. Slow Moving Warm Golden Sunburst Aura
      const auraX = width / 2 + Math.sin(time * 0.001) * 25;
      const auraY = 480 + Math.cos(time * 0.0008) * 20;
      const auraRad = ctx.createRadialGradient(auraX, auraY, 50, auraX, auraY, 450);
      auraRad.addColorStop(0, 'rgba(251, 191, 36, 0.2)');
      auraRad.addColorStop(0.6, 'rgba(245, 158, 11, 0.07)');
      auraRad.addColorStop(1, 'rgba(254, 243, 199, 0)');
      ctx.fillStyle = auraRad;
      ctx.fillRect(0, 0, width, height);

      // C. Rotating Chariot (दिव्य रथ) in background behind shloka cards
      drawRotatingChariotBackground(ctx, width / 2, 470, 175, time);

      // D. Spiritual Floating Golden Sparkle Particles
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += Math.sin(time * 0.0012 + p.phase) * 0.3;
        if (p.y < 20) { p.y = height - 30; p.x = Math.random() * width; }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#d97706';
        ctx.globalAlpha = p.alpha * (0.8 + Math.sin(time * 0.003 + p.phase) * 0.2);
        ctx.fill();
        ctx.restore();
      });

      // E. Top Reel 30-Second Progress Line
      ctx.fillStyle = 'rgba(217, 119, 6, 0.2)';
      ctx.fillRect(36, 26, width - 72, 4);

      const progressWidth = (width - 72) * currentProgress;
      const progGrad = ctx.createLinearGradient(36, 0, 36 + progressWidth, 0);
      progGrad.addColorStop(0, '#b45309');
      progGrad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = progGrad;
      ctx.fillRect(36, 26, progressWidth, 4);

      // F. MANDATED: GEETAFLOW ORIGINAL SACRED CHARIOT BRANDING ON TOP OF VIDEO
      const brandBoxY = 44;
      const brandLogoSize = 46;
      const brandTextX = 282;

      // Draw GeetaFlow Official Sacred Chariot Emblem at Top
      drawGeetaFlowOriginalLogo(ctx, 222, brandBoxY, brandLogoSize);

      // Brand Title: GEETAFLOW
      ctx.textAlign = 'left';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = '#451a03';
      ctx.fillText('GEETAFLOW', brandTextX, brandBoxY + 24);

      // Brand Tagline
      ctx.font = '600 13px sans-serif';
      ctx.fillStyle = '#9a3412';
      ctx.fillText('श्रीमद्भगवद्गीता • The Gita, One Scroll at a Time', brandTextX, brandBoxY + 42);

      // Delicate golden ornament divider line
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(160, 102);
      ctx.lineTo(width - 160, 102);
      ctx.stroke();

      // Top Header: Chapter & Verse
      ctx.textAlign = 'center';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = '#9a3412';
      ctx.fillText('॥ श्रीमद्भगवद्गीता ॥', width / 2, 126);

      ctx.font = '600 25px sans-serif';
      ctx.fillStyle = '#451a03';
      const chName = targetShloka.chapterNameHindi ? ` (${targetShloka.chapterNameHindi})` : '';
      ctx.fillText(`अध्याय ${targetShloka.chapter}${chName} • श्लोक ${targetShloka.verse}`, width / 2, 156);

      // G. MANDATED: PERSONAL TOUCH — USER NAME BADGE
      const personalBadgeY = 172;
      const personalBadgeW = 280;
      const personalBadgeH = 32;
      const personalBadgeX = (width - personalBadgeW) / 2;

      ctx.save();
      ctx.fillStyle = '#fef3c7';
      ctx.strokeStyle = '#fcd34d';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(personalBadgeX, personalBadgeY, personalBadgeW, personalBadgeH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#78350f';
      ctx.fillText(`🪷 स्वाध्यायी: ${userNameDisplay}`, width / 2, personalBadgeY + 21);
      ctx.restore();

      // H. Primary Sanskrit Shloka Box (High-contrast light card)
      const shlokaBoxY = 222;
      const shlokaBoxHeight = 295;
      
      ctx.save();
      ctx.shadowColor = 'rgba(180, 83, 9, 0.12)';
      ctx.shadowBlur = 16;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.45)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(40, shlokaBoxY, width - 80, shlokaBoxHeight, 22);
      ctx.fill();
      ctx.stroke();

      // Inner golden border
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(46, shlokaBoxY + 6, width - 92, shlokaBoxHeight - 12, 18);
      ctx.stroke();
      ctx.restore();

      // Sanskrit Verse Typography in rich deep charcoal
      ctx.textAlign = 'center';
      ctx.font = 'bold 35px "Noto Sans Devanagari", "Tiro Devanagari Sanskrit", serif';
      ctx.fillStyle = '#18181b';

      const sLines = targetShloka.sanskrit.split('\n');
      let currSanskritY = shlokaBoxY + 70;
      sLines.forEach(line => {
        ctx.fillText(line.trim(), width / 2, currSanskritY);
        currSanskritY += 54;
      });

      // Transliteration in warm slate
      if (targetShloka.transliteration) {
        ctx.font = 'italic 18px sans-serif';
        ctx.fillStyle = '#475569';
        const tLines = targetShloka.transliteration.split('\n');
        tLines.slice(0, 2).forEach(tLine => {
          ctx.fillText(tLine.trim(), width / 2, currSanskritY);
          currSanskritY += 30;
        });
      }

      // I. Meaning & Aaj Ki Seekh Card (Light mode)
      const meaningBoxY = 535;
      const meaningBoxHeight = 445;

      ctx.save();
      ctx.shadowColor = 'rgba(180, 83, 9, 0.08)';
      ctx.shadowBlur = 12;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.93)';
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(40, meaningBoxY, width - 80, meaningBoxHeight, 22);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Meaning Section Label
      ctx.textAlign = 'left';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillStyle = '#b45309';
      ctx.fillText('📖 सरल अर्थ (Hindi Meaning)', 68, meaningBoxY + 46);

      // Meaning Text
      ctx.font = '500 23px sans-serif';
      ctx.fillStyle = '#1e293b';
      const afterMeaningY = wrapText(targetShloka.simpleHindi, 68, meaningBoxY + 88, width - 136, 38, 4);

      // Divider
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)';
      ctx.beginPath();
      ctx.moveTo(68, afterMeaningY + 16);
      ctx.lineTo(width - 68, afterMeaningY + 16);
      ctx.stroke();

      // Aaj Ki Seekh Section
      ctx.font = 'bold 22px sans-serif';
      ctx.fillStyle = '#0284c7';
      ctx.fillText('✨ आज की सीख (Practical Takeaway)', 68, afterMeaningY + 54);

      ctx.font = '500 23px sans-serif';
      ctx.fillStyle = '#334155';
      wrapText(targetShloka.aajKiSeekh, 68, afterMeaningY + 94, width - 136, 36, 4);

      // J. MANDATED: OFFICIAL GOOGLE PLAY STORE ORIGINAL LOGO & "Download GeetaFlow App Now from Playstore"
      const brandingY = height - 175;
      const brandingHeight = 122;
      const brandingX = 40;
      const brandingWidth = width - 80;

      ctx.save();
      // Authentic Dark Official Google Play Badge Card
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#090d16';
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(brandingX, brandingY, brandingWidth, brandingHeight, 20);
      ctx.fill();
      ctx.stroke();

      // Draw official 4-Color Google Play Triangle Logo
      drawOfficialGooglePlayLogo(ctx, brandingX + 26, brandingY + 33, 50);

      // Text 1: Official "GET IT ON"
      ctx.textAlign = 'left';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('GET IT ON', brandingX + 90, brandingY + 44);

      // Text 2: Official "Google Play"
      ctx.font = 'bold 25px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Google Play', brandingX + 90, brandingY + 73);

      // Vertical divider in badge
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(brandingX + 258, brandingY + 22);
      ctx.lineTo(brandingX + 258, brandingY + brandingHeight - 22);
      ctx.stroke();

      // Right Text: Mandated Exact Headline: "Download GeetaFlow App Now from Playstore"
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = '#fde68a';
      ctx.fillText('Download GeetaFlow App', brandingX + 276, brandingY + 48);

      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Now from Playstore', brandingX + 276, brandingY + 76);

      // Rating & Tagline
      ctx.font = '500 13px sans-serif';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('★ 4.9 • Free on Android • Sacred Gita', brandingX + 276, brandingY + 102);

      ctx.restore();

      // K. Recording Status / Timer in Video
      ctx.textAlign = 'right';
      ctx.font = '600 16px sans-serif';
      ctx.fillStyle = '#78350f';
      ctx.fillText(`00:${String(curSecs).padStart(2, '0')} / 00:30`, width - 40, 52);

      // Check if 30s finished
      if (elapsed < durationMs) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(render);
  }, [stopAudioAndRecording, preferences?.userName, onClearShloka]);

  // Trigger when shloka prop is supplied
  useEffect(() => {
    if (shloka) {
      startBackgroundRendering(shloka);
    }
  }, [shloka, startBackgroundRendering]);

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      stopAudioAndRecording();
    };
  }, [stopAudioAndRecording]);

  const currentShloka = currentShlokaRef.current;
  if (!currentShloka) return null;

  return (
    <>
      {/* 1. Off-screen 9:16 Canvas element */}
      <canvas 
        ref={canvasRef}
        className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-0"
        width={720}
        height={1280}
      />

      {/* 2. MANDATED: ULTRA-SLIM NON-DISTRACTING FLOATING BAR */}
      {/* It occupies only 3.5px at the top edge with a micro chip so it DOES NOT distract the view! */}
      {(isRendering || isEncodingMp4) && (
        <div 
          id="background-render-bar"
          className="fixed top-0 inset-x-0 z-50 pointer-events-none"
        >
          {/* Razor-thin 3.5px glowing gradient line */}
          <div className="w-full h-1 bg-neutral-950/20 backdrop-blur-xs overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 transition-all duration-200 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
              style={{ width: isEncodingMp4 ? '100%' : `${progress}%` }}
            />
          </div>

          {/* Micro non-distracting pill indicator */}
          <div className="absolute top-1.5 right-3 pointer-events-auto flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-neutral-950/85 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-mono shadow-md">
            {isEncodingMp4 ? (
              <>
                <Loader2 className="w-2.5 h-2.5 text-amber-400 animate-spin" />
                <span>MP4 एनकोडिंग...</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>रील: {progress}%</span>
              </>
            )}
            {onOpenDetailedModal && (
              <button
                onClick={onOpenDetailedModal}
                title="प्रीव्यू देखें"
                className="ml-1 text-neutral-400 hover:text-white transition-colors"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={() => {
                triggerHaptic('light');
                stopAudioAndRecording();
                setIsRendering(false);
                setIsEncodingMp4(false);
                setDownloadCompleted(false);
                onClearShloka();
              }}
              title="रद्द करें"
              className="ml-1 text-neutral-400 hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Small Auto-Dismissing Success Toast Message when video download completes */}
      {successToast && (
        <div 
          id="video-download-success-toast"
          className="fixed top-3 inset-x-4 sm:inset-x-auto sm:right-4 z-50 px-3.5 py-2 rounded-xl bg-neutral-950/95 border border-emerald-500/60 text-emerald-100 text-xs font-hindi shadow-2xl backdrop-blur-md flex items-center space-x-2 animate-fadeIn pointer-events-auto"
        >
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Check className="w-3 h-3" />
          </div>
          <p className="text-[11px] font-hindi text-emerald-200 truncate flex-1">
            {successToast}
          </p>
          <button 
            onClick={() => setSuccessToast(null)}
            className="text-neutral-400 hover:text-white p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </>
  );
};
