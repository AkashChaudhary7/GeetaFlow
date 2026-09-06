/**
 * Subtle tactile haptic feedback engine for mobile web
 * Enhances bookmarking, liking, and reel navigation
 */

export type HapticFeedbackType = 'light' | 'medium' | 'success' | 'doubleTap' | 'warning';

export function triggerHaptic(type: HapticFeedbackType = 'light'): void {
  if (typeof window === 'undefined') return;

  try {
    if (navigator && typeof navigator.vibrate === 'function') {
      switch (type) {
        case 'light':
          // Subtle single click for like/tap
          navigator.vibrate(12);
          break;
        case 'medium':
          // Tactile bump for bookmarking or saving
          navigator.vibrate(25);
          break;
        case 'doubleTap':
          // Rhythmic double-pulse for Instagram-style heart burst
          navigator.vibrate([18, 40, 22]);
          break;
        case 'success':
          // Harmonious triple-pulse
          navigator.vibrate([15, 30, 15, 30, 25]);
          break;
        case 'warning':
          navigator.vibrate([40, 50, 40]);
          break;
        default:
          navigator.vibrate(15);
      }
    }
  } catch (err) {
    // Non-fatal fallback for environments where vibration is restricted
  }
}
