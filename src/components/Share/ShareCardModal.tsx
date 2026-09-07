import React, { useRef, useState, useEffect } from 'react';
import { Shloka, UserPreferences } from '../../types';
import { X, Copy, Download, Share2, Check, ArrowLeft, User, Sparkles, Edit3, Palette } from 'lucide-react';
import { ArtworkCanvas } from '../Common/ArtworkCanvas';
import { AppLogo } from '../Common/AppLogo';
import { triggerHaptic } from '../../utils/haptics';

interface ShareCardModalProps {
  shloka: Shloka | null;
  isOpen: boolean;
  onClose: () => void;
  preferences?: UserPreferences;
  onUpdatePreferences?: (updater: (prev: UserPreferences) => UserPreferences) => void;
  isLight?: boolean;
}

type CardTheme = 'celestial' | 'gold' | 'ivory';

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  shloka,
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  isLight = false
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isShareSupported, setIsShareSupported] = useState(false);
  const [cardTheme, setCardTheme] = useState<CardTheme>(isLight ? 'ivory' : 'celestial');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userName, setUserName] = useState(preferences?.userName || '');
  const [userAbout, setUserAbout] = useState(preferences?.userAbout || '');
  const [includeSignature, setIncludeSignature] = useState(preferences?.showPersonalSignatureOnShare !== false);

  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsShareSupported(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  useEffect(() => {
    if (preferences?.userName) setUserName(preferences.userName);
    if (preferences?.userAbout) setUserAbout(preferences.userAbout);
    if (preferences?.showPersonalSignatureOnShare !== undefined) {
      setIncludeSignature(preferences.showPersonalSignatureOnShare);
    }
  }, [preferences]);

  if (!isOpen || !shloka) return null;

  const handleSaveProfile = () => {
    if (onUpdatePreferences) {
      onUpdatePreferences(p => ({
        ...p,
        userName: userName.trim(),
        userAbout: userAbout.trim(),
        showPersonalSignatureOnShare: includeSignature
      }));
    }
    setShowEditProfile(false);
    triggerHaptic('success');
  };

  const getShareText = () => {
    let text = `🌸 श्रीमद्भगवद्गीता (अध्याय ${shloka.chapter}, श्लोक ${shloka.verse})\n\n"${shloka.sanskrit}"\n\n📌 सरल अर्थ: ${shloka.simpleHindi}\n\n✨ आज की सीख: ${shloka.aajKiSeekh}`;
    
    if (includeSignature && (userName.trim() || userAbout.trim())) {
      text += `\n\n— साधक संदेश: ${userName.trim() ? userName.trim() : ''}${userAbout.trim() ? ` ("${userAbout.trim()}")` : ''}`;
    }

    text += `\n\n📱 GeetaFlow App से साझा किया गया • The Gita, one scroll at a time.\n🔗 ${window.location.href}`;
    return text;
  };

  const handleCopy = async () => {
    triggerHaptic('light');
    try {
      await navigator.clipboard.writeText(getShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  /**
   * Generates a high-quality PNG image of the share card using HTML5 canvas
   */
  const generateCardBlob = async (): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. Background Fill according to Theme
    if (cardTheme === 'ivory') {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#fdfbf7');
      bgGrad.addColorStop(0.5, '#fef9ee');
      bgGrad.addColorStop(1, '#f7f1e3');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle warm circular glow
      const radial = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 600);
      radial.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
      radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);
    } else if (cardTheme === 'gold') {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#1c1306');
      bgGrad.addColorStop(0.5, '#2e1c07');
      bgGrad.addColorStop(1, '#180f04');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const radial = ctx.createRadialGradient(width / 2, 400, 100, width / 2, 400, 700);
      radial.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Celestial Dark
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#090a0f');
      bgGrad.addColorStop(0.4, '#0d111a');
      bgGrad.addColorStop(1, '#05070a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const radial = ctx.createRadialGradient(width / 2, 350, 80, width / 2, 350, 650);
      radial.addColorStop(0, 'rgba(217, 119, 6, 0.15)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Ornamental Border
    ctx.lineWidth = 4;
    ctx.strokeStyle = cardTheme === 'ivory' ? 'rgba(217, 119, 6, 0.35)' : 'rgba(245, 158, 11, 0.4)';
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = cardTheme === 'ivory' ? 'rgba(180, 83, 9, 0.2)' : 'rgba(245, 158, 11, 0.2)';
    ctx.strokeRect(52, 52, width - 104, height - 104);

    // 3. Top Branding Header
    ctx.textAlign = 'center';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = cardTheme === 'ivory' ? '#92400e' : '#f59e0b';
    ctx.fillText('॥ GEETAFLOW • श्रीमद्भगवद्गीता ॥', width / 2, 125);

    // Chapter & Verse sub-badge
    ctx.font = '600 28px sans-serif';
    ctx.fillStyle = cardTheme === 'ivory' ? '#b45309' : '#fcd34d';
    ctx.fillText(`अध्याय ${shloka.chapter} (${shloka.chapterNameHindi || shloka.chapterNameSanskrit}) • श्लोक ${shloka.verse}`, width / 2, 175);

    // Decorative divider line
    ctx.strokeStyle = cardTheme === 'ivory' ? 'rgba(217, 119, 6, 0.3)' : 'rgba(245, 158, 11, 0.3)';
    ctx.beginPath();
    ctx.moveTo(150, 205);
    ctx.lineTo(width - 150, 205);
    ctx.stroke();

    // 4. Sanskrit Shloka Box
    const sanskritY = 280;
    ctx.font = 'bold 44px "Noto Sans Devanagari", "Tiro Devanagari Sanskrit", serif';
    ctx.fillStyle = cardTheme === 'ivory' ? '#451a03' : '#fef3c7';

    // Wrap sanskrit lines cleanly
    const sanskritLines = shloka.sanskrit.split('\n');
    let currentY = sanskritY;
    sanskritLines.forEach(line => {
      ctx.fillText(line.trim(), width / 2, currentY);
      currentY += 68;
    });

    // 5. Transliteration (if available)
    if (shloka.transliteration) {
      currentY += 15;
      ctx.font = 'italic 26px sans-serif';
      ctx.fillStyle = cardTheme === 'ivory' ? '#78350f' : '#cbd5e1';
      const transLines = shloka.transliteration.split('\n');
      transLines.slice(0, 2).forEach(line => {
        ctx.fillText(line.trim(), width / 2, currentY);
        currentY += 40;
      });
    }

    currentY += 35;

    // Helper for multi-line text wrapping inside card boxes
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number = 4) => {
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

    // 6. Simple Hindi Meaning Card Box
    const boxX = 90;
    const boxWidth = width - 180;
    const hindiBoxY = currentY;
    const hindiBoxHeight = 220;

    ctx.fillStyle = cardTheme === 'ivory' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.4)';
    ctx.strokeStyle = cardTheme === 'ivory' ? 'rgba(217, 119, 6, 0.25)' : 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(boxX, hindiBoxY, boxWidth, hindiBoxHeight, 20);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = cardTheme === 'ivory' ? '#b45309' : '#f59e0b';
    ctx.fillText('सरल अर्थ:', boxX + 30, hindiBoxY + 45);

    ctx.font = '30px sans-serif';
    ctx.fillStyle = cardTheme === 'ivory' ? '#1c1917' : '#f1f5f9';
    wrapText(shloka.simpleHindi, boxX + 30, hindiBoxY + 92, boxWidth - 60, 42, 3);

    currentY = hindiBoxY + hindiBoxHeight + 25;

    // 7. Aaj Ki Seekh Card Box
    const seekhBoxY = currentY;
    const seekhBoxHeight = 140;

    ctx.fillStyle = cardTheme === 'ivory' ? 'rgba(254, 243, 199, 0.6)' : 'rgba(245, 158, 11, 0.08)';
    ctx.strokeStyle = cardTheme === 'ivory' ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.25)';
    ctx.beginPath();
    ctx.roundRect(boxX, seekhBoxY, boxWidth, seekhBoxHeight, 18);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = cardTheme === 'ivory' ? '#b45309' : '#fcd34d';
    ctx.fillText('आज की सीख:', boxX + 25, seekhBoxY + 42);

    ctx.font = '26px sans-serif';
    ctx.fillStyle = cardTheme === 'ivory' ? '#451a03' : '#fef3c7';
    wrapText(shloka.aajKiSeekh, boxX + 25, seekhBoxY + 84, boxWidth - 50, 38, 2);

    currentY = seekhBoxY + seekhBoxHeight + 30;

    // 8. Personal Touch Seeker Signature Box (if enabled & present)
    if (includeSignature && (userName.trim() || userAbout.trim())) {
      const sigBoxY = currentY;
      const sigBoxHeight = 135;

      // Bright golden gradient signature banner
      const sigGrad = ctx.createLinearGradient(boxX, sigBoxY, boxX + boxWidth, sigBoxY);
      if (cardTheme === 'ivory') {
        sigGrad.addColorStop(0, 'rgba(251, 191, 36, 0.2)');
        sigGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.28)');
        sigGrad.addColorStop(1, 'rgba(251, 191, 36, 0.2)');
      } else {
        sigGrad.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
        sigGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.35)');
        sigGrad.addColorStop(1, 'rgba(245, 158, 11, 0.2)');
      }

      ctx.fillStyle = sigGrad;
      ctx.strokeStyle = cardTheme === 'ivory' ? '#d97706' : '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(boxX, sigBoxY, boxWidth, sigBoxHeight, 20);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillStyle = cardTheme === 'ivory' ? '#451a03' : '#fde68a';
      ctx.fillText('✦ साधक का व्यक्तिगत संदेश ✦', width / 2, sigBoxY + 38);

      ctx.font = 'bold 32px sans-serif';
      // User name visible perfectly: dark color in light/ivory theme, light color in dark theme
      ctx.fillStyle = cardTheme === 'ivory' ? '#171717' : '#ffffff';
      const displayName = userName.trim() ? userName.trim() : 'साधक';
      ctx.fillText(displayName, width / 2, sigBoxY + 76);

      if (userAbout.trim()) {
        ctx.font = 'italic 23px sans-serif';
        ctx.fillStyle = cardTheme === 'ivory' ? '#262626' : '#fef08a';
        ctx.fillText(`“${userAbout.trim()}”`, width / 2, sigBoxY + 110);
      }
    }

    // 9. Bottom Branding Watermark
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = cardTheme === 'ivory' ? '#92400e' : '#f59e0b';
    ctx.fillText('GeetaFlow • The Gita, one scroll at a time.', width / 2, height - 85);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = cardTheme === 'ivory' ? '#a8a29e' : '#64748b';
    ctx.fillText('geetaflow.app', width / 2, height - 60);

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
    });
  };

  /**
   * Directly downloads the generated PNG card to user device
   */
  const handleDownloadImage = async () => {
    triggerHaptic('medium');
    setIsGeneratingImage(true);
    try {
      const blob = await generateCardBlob();
      if (!blob) throw new Error('Canvas blob generation failed');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GeetaFlow_Adhyay_${shloka.chapter}_Shloka_${shloka.verse}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerHaptic('success');
    } catch (e) {
      console.error('Download image error:', e);
      handleCopy();
    } finally {
      setIsGeneratingImage(false);
    }
  };

  /**
   * Primary Web Share API handler: launches the native system share dialog with image & rich shloka text
   */
  const handleShareSystemDialog = async () => {
    triggerHaptic('medium');
    setIsSharing(true);

    try {
      const shareText = getShareText();
      const shareTitle = `श्रीमद्भगवद्गीता • अध्याय ${shloka.chapter} श्लोक ${shloka.verse}`;
      const shareUrl = window.location.href;

      // 1. Generate high-resolution card image blob
      let file: File | null = null;
      try {
        const blob = await generateCardBlob();
        if (blob) {
          file = new File(
            [blob], 
            `GeetaFlow_Chapter_${shloka.chapter}_Verse_${shloka.verse}.png`, 
            { type: 'image/png' }
          );
        }
      } catch (blobErr) {
        console.warn('Canvas blob generation failed, continuing with text share:', blobErr);
      }

      // 2. Invoke native Web Share API
      if (typeof navigator !== 'undefined' && navigator.share) {
        // Test if rich file sharing is supported on this device/browser
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: shareTitle,
            text: shareText,
            url: shareUrl,
          });
          triggerHaptic('success');
          return;
        }

        // Fallback to native text & URL share if file attachment is unsupported
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        triggerHaptic('success');
        return;
      }

      // 3. Fallback when navigator.share is completely unavailable
      await handleDownloadImage();
      await handleCopy();
    } catch (e: any) {
      // AbortError is triggered when user dismisses the system dialog; ignore quietly
      if (e?.name !== 'AbortError') {
        console.warn('Native share dialog error:', e);
        handleCopy();
      }
    } finally {
      setIsSharing(false);
    }
  };

  /**
   * Direct WhatsApp Web / Mobile share link
   */
  const handleWhatsAppShare = () => {
    triggerHaptic('light');
    const text = encodeURIComponent(getShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const isCurrentLight = cardTheme === 'ivory';

  return (
    <div className="fixed inset-0 z-50 flex flex-col w-full h-full bg-neutral-950 text-neutral-100 overflow-hidden animate-fadeIn">
      {/* Top App Bar */}
      <div className="w-full px-4 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90 backdrop-blur-md shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
            aria-label="वापस जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-hindi hidden sm:inline">वापस</span>
          </button>
          <span className="text-sm font-semibold text-amber-300 font-hindi">
            सुंदर श्लोक कार्ड साझा करें
          </span>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 rounded-full text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Theme Selector & Personal Signature Controls Bar */}
      <div className="px-4 py-2.5 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-xs flex flex-wrap items-center justify-between gap-2 shrink-0">
        {/* Theme Pills */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] text-neutral-400 font-hindi flex items-center gap-1 mr-1">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            थीम:
          </span>
          {[
            { id: 'celestial' as CardTheme, label: 'ब्रह्मांडीय (Dark)' },
            { id: 'gold' as CardTheme, label: 'स्वर्ण (Gold)' },
            { id: 'ivory' as CardTheme, label: 'उज्ज्वल (Ivory)' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => {
                triggerHaptic('light');
                setCardTheme(t.id);
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-hindi transition-all ${
                cardTheme === t.id
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Personal Signature Toggle / Edit */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowEditProfile(!showEditProfile)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-hindi border flex items-center space-x-1 transition-all ${
              showEditProfile
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:text-white'
            }`}
          >
            <User className="w-3 h-3 text-amber-400" />
            <span>व्यक्तिगत नाम जोड़ें</span>
            <Edit3 className="w-3 h-3 ml-0.5 opacity-70" />
          </button>
        </div>
      </div>

      {/* Profile & Signature Inline Edit Dropdown */}
      {showEditProfile && (
        <div className="p-3.5 bg-neutral-900 border-b border-amber-500/30 space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-hindi">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              शेयर कार्ड पर आपका नाम व परिचय (Personal Signature)
            </span>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSignature}
                onChange={(e) => setIncludeSignature(e.target.checked)}
                className="w-3.5 h-3.5 accent-amber-500"
              />
              <span className="text-[11px] text-neutral-300">कार्ड पर दिखाएं</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-neutral-400 block mb-0.5 font-hindi">आपका नाम (Your Name)</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="उदा. अर्जुन शर्मा / साधक"
                className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs font-hindi text-amber-100 placeholder-neutral-500 focus:outline-hidden focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 block mb-0.5 font-hindi">विचार / परिचय (About / Quote)</label>
              <input
                type="text"
                value={userAbout}
                onChange={(e) => setUserAbout(e.target.value)}
                placeholder="उदा. कर्म ही पूजा है • गीता अभ्यासी"
                className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs font-hindi text-amber-100 placeholder-neutral-500 focus:outline-hidden focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleSaveProfile}
              className="px-3.5 py-1 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs font-hindi shadow-xs hover:bg-amber-400 transition-colors"
            >
              सहेजें (Apply)
            </button>
          </div>
        </div>
      )}

      {/* The Visual Share Card Preview */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center no-scrollbar">
        <div 
          ref={cardRef}
          className={`w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center space-y-3.5 border transition-all ${
            cardTheme === 'ivory'
              ? 'bg-gradient-to-b from-[#fdfbf7] via-[#fef8ea] to-[#f5eedc] text-amber-950 border-amber-400/40 shadow-amber-900/10'
              : cardTheme === 'gold'
                ? 'bg-gradient-to-b from-[#1f1505] via-[#2d1c07] to-[#140c03] text-amber-100 border-amber-400/50 shadow-amber-500/20'
                : 'bg-gradient-to-b from-neutral-950 via-neutral-900 to-amber-950/40 text-neutral-100 border-amber-500/30 shadow-black'
          }`}
        >
          {/* Top Brand & Chapter */}
          <div className={`w-full flex items-center justify-between text-[11px] sm:text-xs font-hindi border-b pb-2 ${
            isCurrentLight ? 'text-amber-800 border-amber-300/40' : 'text-amber-400 border-amber-500/20'
          }`}>
            <AppLogo size="xs" showText={true} isLight={isCurrentLight} />
            <span className="font-semibold text-xs font-hindi">अध्याय {shloka.chapter} • श्लोक {shloka.verse}</span>
          </div>

          {/* Artwork - Unique Doodle */}
          <ArtworkCanvas 
            type={shloka.illustration} 
            shlokaId={shloka.id}
            chapter={shloka.chapter}
            verse={shloka.verse}
            size="sm" 
            isLight={isCurrentLight}
          />

          {/* Sanskrit Shloka */}
          <p className={`font-sanskrit text-sm sm:text-base font-bold leading-relaxed whitespace-pre-line ${
            isCurrentLight ? 'text-amber-950' : 'text-amber-100 sanskrit-glow'
          }`}>
            {shloka.sanskrit}
          </p>

          {/* Hindi Meaning */}
          <div className={`w-full p-3 rounded-xl border text-left ${
            isCurrentLight 
              ? 'bg-white/85 border-amber-200 text-amber-950 shadow-2xs' 
              : 'bg-neutral-950/70 border-neutral-800/80 text-neutral-200'
          }`}>
            <p className="font-hindi text-xs sm:text-sm leading-relaxed">
              <span className={`font-semibold ${isCurrentLight ? 'text-amber-700' : 'text-amber-400'}`}>सरल अर्थ: </span>
              {shloka.simpleHindi}
            </p>
          </div>

          {/* Aaj Ki Seekh */}
          <div className={`w-full p-2.5 sm:p-3 rounded-xl border text-left ${
            isCurrentLight 
              ? 'bg-amber-100/70 border-amber-300/60 text-amber-900' 
              : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
          }`}>
            <p className="font-hindi text-[11px] sm:text-xs leading-normal">
              <span className={`font-semibold ${isCurrentLight ? 'text-amber-800' : 'text-amber-400'}`}>आज की सीख: </span>
              {shloka.aajKiSeekh}
            </p>
          </div>

          {/* Personal Seeker Signature Badge (High Contrast & Legible) */}
          {includeSignature && (userName.trim() || userAbout.trim()) && (
            <div className={`w-full p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-0.5 text-center animate-fadeIn ${
              isCurrentLight
                ? 'bg-amber-100/90 border-amber-300 shadow-2xs'
                : 'bg-neutral-900/90 border-neutral-700 shadow-md shadow-black/40'
            }`}>
              <div className="flex items-center space-x-1 text-[10px] font-hindi uppercase tracking-wider opacity-85">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className={isCurrentLight ? 'text-amber-950 font-semibold' : 'text-amber-300 font-semibold'}>साधक का संदेश</span>
              </div>
              {/* User Name: Dark color in light theme, Light color in dark theme */}
              <p className={`font-hindi font-bold text-sm sm:text-base tracking-wide ${
                isCurrentLight ? 'text-neutral-950 font-black' : 'text-white font-black'
              }`}>
                {userName.trim() || 'साधक'}
              </p>
              {userAbout.trim() && (
                <p className={`font-hindi text-[11px] italic font-medium ${
                  isCurrentLight ? 'text-neutral-800' : 'text-neutral-200'
                }`}>
                  "{userAbout.trim()}"
                </p>
              )}
            </div>
          )}

          {/* Watermark & App Link */}
          <div className={`text-[10px] sm:text-xs font-display tracking-widest pt-1 ${
            isCurrentLight ? 'text-amber-800/60' : 'text-neutral-500'
          }`}>
            GEETAFLOW.APP • THE GITA, ONE SCROLL AT A TIME
          </div>
        </div>
      </div>

      {/* Share Actions Footer */}
      <div className="w-full p-4 border-t border-neutral-800 bg-neutral-900/95 shrink-0 shadow-xl">
        <div className="max-w-md mx-auto space-y-2.5">
          {/* Primary Action: Share System Dialog (When Web Share API is available) */}
          {isShareSupported ? (
            <button
              onClick={handleShareSystemDialog}
              disabled={isSharing || isGeneratingImage}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-bold text-sm flex items-center justify-center space-x-2.5 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all font-hindi disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSharing || isGeneratingImage ? (
                <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Share2 className="w-4.5 h-4.5 stroke-[2.5]" />
              )}
              <div className="flex flex-col items-center">
                <span>सिस्टम शेयर डायलॉग (Share System Dialog)</span>
                <span className="text-[10px] font-normal text-neutral-900/80 -mt-0.5">
                  WhatsApp, Instagram, Telegram व अन्य ऐप्स में साझा करें
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={handleDownloadImage}
              disabled={isGeneratingImage}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all font-hindi disabled:opacity-75"
            >
              {isGeneratingImage ? (
                <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4.5 h-4.5 stroke-[2.5]" />
              )}
              <span>सुंदर इमेज कार्ड डाउनलोड करें (Download Card)</span>
            </button>
          )}

          {/* Secondary Actions Row */}
          <div className="grid grid-cols-3 gap-2">
            {/* Copy Shloka Text */}
            <button
              onClick={handleCopy}
              className="py-2.5 px-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all font-hindi border border-neutral-700 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <Copy className="w-4 h-4 text-neutral-300 shrink-0" />}
              <span className="text-[11px] truncate">{copied ? 'कॉपी हुआ!' : 'टेक्स्ट कॉपी'}</span>
            </button>

            {/* Save Card Image (Available in both modes) */}
            <button
              onClick={handleDownloadImage}
              disabled={isGeneratingImage || isSharing}
              className="py-2.5 px-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all font-hindi border border-amber-500/30 active:scale-95 disabled:opacity-60"
            >
              <Download className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] truncate">इमेज सेव</span>
            </button>

            {/* Direct WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              className="py-2.5 px-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all font-hindi border border-emerald-600/40 active:scale-95"
              title="WhatsApp पर भेजें"
            >
              <Share2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px] truncate">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
