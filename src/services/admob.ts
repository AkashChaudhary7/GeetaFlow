/**
 * Monetization & Advertising Service for GeetaFlow PWA
 * 
 * Fully compatible with:
 * 1. PWA & Web Browsers (Chrome, Safari, Edge, Firefox)
 * 2. PWABuilder Android TWA & Google Play Web App wrappers (window.AndroidAdMob)
 * 3. Safe in-memory simulation with zero native compilation dependencies
 */

export interface AdMobConfig {
  androidAppId: string;
  bannerAdId: string;
  interstitialAdId: string;
  rewardedAdId: string;
  isTesting: boolean;
  frequencyCapSeconds: number; // minimum cooldown between interstitial ads
}

export const GOOGLE_TEST_AD_UNITS = {
  androidAppId: 'ca-app-pub-3940256099942544~3347511713',
  bannerAdId: 'ca-app-pub-3940256099942544/6300978111',
  interstitialAdId: 'ca-app-pub-3940256099942544/1033173712',
  rewardedAdId: 'ca-app-pub-3940256099942544/5224354917',
};

const ADMOB_CONFIG_STORAGE_KEY = 'geetaflow_admob_config_v1';

class AdMobService {
  private config: AdMobConfig;
  private isInitialized = false;
  private isBannerVisible = false;
  private lastInterstitialTimestamp = 0;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AdMobConfig {
    if (typeof window === 'undefined') {
      return {
        ...GOOGLE_TEST_AD_UNITS,
        isTesting: true,
        frequencyCapSeconds: 90,
      };
    }

    try {
      const saved = localStorage.getItem(ADMOB_CONFIG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          androidAppId: parsed.androidAppId || (import.meta as any).env?.VITE_ADMOB_ANDROID_APP_ID || GOOGLE_TEST_AD_UNITS.androidAppId,
          bannerAdId: parsed.bannerAdId || (import.meta as any).env?.VITE_ADMOB_BANNER_ID || GOOGLE_TEST_AD_UNITS.bannerAdId,
          interstitialAdId: parsed.interstitialAdId || (import.meta as any).env?.VITE_ADMOB_INTERSTITIAL_ID || GOOGLE_TEST_AD_UNITS.interstitialAdId,
          rewardedAdId: parsed.rewardedAdId || (import.meta as any).env?.VITE_ADMOB_REWARDED_ID || GOOGLE_TEST_AD_UNITS.rewardedAdId,
          isTesting: parsed.isTesting !== undefined ? parsed.isTesting : true,
          frequencyCapSeconds: parsed.frequencyCapSeconds || 90,
        };
      }
    } catch (e) {
      console.warn('[AdMob] Failed to load config from storage:', e);
    }

    return {
      androidAppId: (import.meta as any).env?.VITE_ADMOB_ANDROID_APP_ID || GOOGLE_TEST_AD_UNITS.androidAppId,
      bannerAdId: (import.meta as any).env?.VITE_ADMOB_BANNER_ID || GOOGLE_TEST_AD_UNITS.bannerAdId,
      interstitialAdId: (import.meta as any).env?.VITE_ADMOB_INTERSTITIAL_ID || GOOGLE_TEST_AD_UNITS.interstitialAdId,
      rewardedAdId: (import.meta as any).env?.VITE_ADMOB_REWARDED_ID || GOOGLE_TEST_AD_UNITS.rewardedAdId,
      isTesting: true,
      frequencyCapSeconds: 90,
    };
  }

  public saveConfig(newConfig: Partial<AdMobConfig>) {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(ADMOB_CONFIG_STORAGE_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.warn('[AdMob] Failed to save config:', e);
    }
  }

  public getConfig(): AdMobConfig {
    return { ...this.config };
  }

  public isNative(): boolean {
    return false;
  }

  public hasCustomWebViewBridge(): boolean {
    return typeof window !== 'undefined' && typeof (window as any).AndroidAdMob !== 'undefined';
  }

  /**
   * Initialize Advertising Service
   */
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      if (this.hasCustomWebViewBridge()) {
        try {
          (window as any).AndroidAdMob.init?.(this.config.androidAppId);
        } catch (bridgeErr) {
          console.warn('[AdMob] Custom bridge init warning:', bridgeErr);
        }
      }
      this.isInitialized = true;
      return true;
    } catch (err) {
      this.isInitialized = true;
      return false;
    }
  }

  public async preloadInterstitial(): Promise<void> {
    // Web / PWA no-op
  }

  public async preloadRewarded(): Promise<void> {
    // Web / PWA no-op
  }

  public async showBanner(_bottomMarginDp: number = 54): Promise<boolean> {
    this.isBannerVisible = true;
    if (this.hasCustomWebViewBridge()) {
      try {
        (window as any).AndroidAdMob.showBanner?.(this.config.bannerAdId);
      } catch (e) {
        console.warn('[AdMob Bridge Error]:', e);
      }
    }
    return true;
  }

  public async hideBanner(): Promise<void> {
    this.isBannerVisible = false;
    if (this.hasCustomWebViewBridge()) {
      try {
        (window as any).AndroidAdMob.hideBanner?.();
      } catch (e) {
        console.warn('[AdMob Bridge Error]:', e);
      }
    }
  }

  public async resumeBanner(): Promise<void> {
    this.showBanner();
  }

  /**
   * Trigger an Interstitial Ad with built-in Frequency Capping
   */
  public async showInterstitialAd(
    placement: string = 'general',
    bypassFrequencyCap: boolean = false
  ): Promise<boolean> {
    const now = Date.now();
    const elapsedSinceLast = (now - this.lastInterstitialTimestamp) / 1000;

    if (!bypassFrequencyCap && elapsedSinceLast < this.config.frequencyCapSeconds) {
      return false;
    }

    this.lastInterstitialTimestamp = now;

    if (this.hasCustomWebViewBridge()) {
      try {
        (window as any).AndroidAdMob.showInterstitial?.(placement);
      } catch (e) {
        console.warn('[AdMob Bridge Error]:', e);
      }
    } else {
      console.log(`[PWA Ad Event] Interstitial triggered: "${placement}"`);
    }

    return true;
  }

  /**
   * Show a Rewarded Video Ad
   */
  public async showRewardedAd(
    reason: string = 'unlock_premium_perk',
    onRewardEarned?: (rewardType: string, amount: number) => void
  ): Promise<boolean> {
    if (this.hasCustomWebViewBridge()) {
      try {
        (window as any).AndroidAdMob.showRewarded?.(reason);
        if (onRewardEarned) onRewardEarned('divine_blessing', 1);
        return true;
      } catch (e) {
        console.warn('[AdMob Bridge Error]:', e);
      }
    }

    // PWA simulation: grant reward smoothly
    console.log(`[PWA Ad Event] Rewarded video perk unlocked for: "${reason}"`);
    if (onRewardEarned) {
      onRewardEarned('divine_blessing', 1);
    }
    return true;
  }
}

export const admobService = new AdMobService();
