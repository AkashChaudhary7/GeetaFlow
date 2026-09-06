/**
 * Google AdMob Monetization Service for GeetaFlow
 * 
 * Supports:
 * 1. Native Android via @capacitor-community/admob (for Google Play .aab bundle)
 * 2. Native Android WebView bridge (window.AndroidAdMob)
 * 3. Safe Web preview simulation (logs events, triggers callbacks without errors)
 * 
 * Includes:
 * - Smart Adaptive Banner (Bottom of feed, respectful margin)
 * - High eCPM Interstitial Ads (Frequency-capped, shown after video reel export & milestone reads)
 * - Maximum eCPM Rewarded Video Ads (User-opted unlock for HD/4K export & audio perks)
 */

import { Capacitor } from '@capacitor/core';
import { 
  AdMob, 
  BannerAdPosition, 
  BannerAdSize,
  BannerAdPluginEvents,
  InterstitialAdPluginEvents,
  RewardAdPluginEvents
} from '@capacitor-community/admob';

export interface AdMobConfig {
  androidAppId: string;
  bannerAdId: string;
  interstitialAdId: string;
  rewardedAdId: string;
  isTesting: boolean;
  frequencyCapSeconds: number; // minimum cooldown between interstitial ads
}

// Official Google AdMob Test Ad Units for Android
// (Safe to test without getting account banned; replace with live IDs for production .aab release)
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
  private isInterstitialReady = false;
  private isRewardedReady = false;
  private lastInterstitialTimestamp = 0;
  private listenersAttached = false;

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
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
  }

  public hasCustomWebViewBridge(): boolean {
    return typeof window !== 'undefined' && typeof (window as any).AndroidAdMob !== 'undefined';
  }

  /**
   * Initialize Google AdMob SDK
   */
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      if (this.isNative()) {
        await AdMob.initialize({
          testingDevices: this.config.isTesting ? ['2077ef9a63d2b398840261c8221a0c9b'] : undefined,
          initializeForTesting: this.config.isTesting,
        });

        this.setupNativeEventListeners();
        // Pre-load initial interstitial and rewarded ads in background
        this.preloadInterstitial();
        this.preloadRewarded();
        // Automatically show the adaptive bottom banner
        this.showBanner(56);
        console.log('[AdMob] Native SDK initialized & banner auto-displayed for Android AAB');
      } else if (this.hasCustomWebViewBridge()) {
        try {
          (window as any).AndroidAdMob.init?.(this.config.androidAppId);
        } catch (bridgeErr) {
          console.warn('[AdMob] Custom bridge init warning:', bridgeErr);
        }
      } else {
        console.log('[AdMob] Web / Preview mode active. Ads will operate in safe preview mode.');
      }

      this.isInitialized = true;
      return true;
    } catch (err) {
      console.warn('[AdMob] Init warning (normal on web browser preview):', err);
      this.isInitialized = true;
      return false;
    }
  }

  private setupNativeEventListeners() {
    if (this.listenersAttached || !this.isNative()) return;
    this.listenersAttached = true;

    try {
      AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
        this.isBannerVisible = true;
        console.log('[AdMob] Banner ad loaded and visible');
      });

      AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err) => {
        this.isBannerVisible = false;
        console.warn('[AdMob] Banner failed to load:', err);
      });

      AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
        this.isInterstitialReady = true;
        console.log('[AdMob] Interstitial ad ready in background cache');
      });

      AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
        this.isInterstitialReady = false;
        this.preloadInterstitial(); // automatically reload for next event
      });

      AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
        this.isRewardedReady = true;
        console.log('[AdMob] Rewarded video ad ready in background cache');
      });

      AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
        this.isRewardedReady = false;
        this.preloadRewarded(); // automatically reload for next reward request
      });
    } catch (e) {
      console.warn('[AdMob] Event listener registration:', e);
    }
  }

  /**
   * Pre-load an Interstitial Ad in background memory for instant presentation
   */
  public async preloadInterstitial(): Promise<void> {
    if (!this.isNative()) return;
    try {
      await AdMob.prepareInterstitial({
        adId: this.config.interstitialAdId,
        isTesting: this.config.isTesting,
      });
      this.isInterstitialReady = true;
    } catch (err) {
      this.isInterstitialReady = false;
      console.warn('[AdMob] Preload interstitial warning:', err);
    }
  }

  /**
   * Pre-load a Rewarded Video Ad in background memory
   */
  public async preloadRewarded(): Promise<void> {
    if (!this.isNative()) return;
    try {
      await AdMob.prepareRewardVideoAd({
        adId: this.config.rewardedAdId,
        isTesting: this.config.isTesting,
      });
      this.isRewardedReady = true;
    } catch (err) {
      this.isRewardedReady = false;
      console.warn('[AdMob] Preload rewarded warning:', err);
    }
  }

  /**
   * Show Adaptive Banner Ad at bottom
   * Margin ensures it does not block the bottom navigation bar or swipe areas
   */
  public async showBanner(bottomMarginDp: number = 54): Promise<boolean> {
    if (this.isBannerVisible) return true;

    try {
      if (this.isNative()) {
        await AdMob.showBanner({
          adId: this.config.bannerAdId,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: bottomMarginDp,
          isTesting: this.config.isTesting,
        });
        this.isBannerVisible = true;
        return true;
      } else if (this.hasCustomWebViewBridge()) {
        (window as any).AndroidAdMob.showBanner?.(this.config.bannerAdId);
        this.isBannerVisible = true;
        return true;
      } else {
        // Web preview simulation
        this.isBannerVisible = true;
        return true;
      }
    } catch (err) {
      console.warn('[AdMob] Show banner warning:', err);
      return false;
    }
  }

  /**
   * Hide Banner Ad (e.g. during video rendering, fullscreen modals)
   */
  public async hideBanner(): Promise<void> {
    try {
      if (this.isNative() && this.isBannerVisible) {
        await AdMob.hideBanner();
        this.isBannerVisible = false;
      } else if (this.hasCustomWebViewBridge()) {
        (window as any).AndroidAdMob.hideBanner?.();
        this.isBannerVisible = false;
      } else {
        this.isBannerVisible = false;
      }
    } catch (err) {
      console.warn('[AdMob] Hide banner warning:', err);
    }
  }

  /**
   * Resume/Display Banner Ad again after modal closes
   */
  public async resumeBanner(): Promise<void> {
    try {
      if (this.isNative()) {
        await AdMob.resumeBanner();
        this.isBannerVisible = true;
      } else {
        this.isBannerVisible = true;
      }
    } catch (err) {
      // If resume fails, attempt showBanner
      this.showBanner();
    }
  }

  /**
   * Trigger an Interstitial Ad with built-in Frequency Capping
   * @param placement string identifying context, e.g. 'reel_download', 'feed_milestone'
   * @param bypassFrequencyCap boolean if explicitly forced (e.g. testing)
   */
  public async showInterstitialAd(
    placement: string = 'general',
    bypassFrequencyCap: boolean = false
  ): Promise<boolean> {
    const now = Date.now();
    const elapsedSinceLast = (now - this.lastInterstitialTimestamp) / 1000;

    if (!bypassFrequencyCap && elapsedSinceLast < this.config.frequencyCapSeconds) {
      console.log(`[AdMob] Interstitial skipped due to frequency cap (${Math.round(elapsedSinceLast)}s / ${this.config.frequencyCapSeconds}s)`);
      return false;
    }

    try {
      if (this.isNative()) {
        if (!this.isInterstitialReady) {
          await this.preloadInterstitial();
        }
        await AdMob.showInterstitial();
        this.lastInterstitialTimestamp = now;
        this.isInterstitialReady = false;
        this.preloadInterstitial();
        return true;
      } else if (this.hasCustomWebViewBridge()) {
        (window as any).AndroidAdMob.showInterstitial?.(placement);
        this.lastInterstitialTimestamp = now;
        return true;
      } else {
        // Web preview simulation: Log clearly in console
        console.log(`[AdMob Simulation] Interstitial displayed for placement: "${placement}". Frequency capped at ${this.config.frequencyCapSeconds}s.`);
        this.lastInterstitialTimestamp = now;
        return true;
      }
    } catch (err) {
      console.warn('[AdMob] Interstitial presentation warning:', err);
      // Attempt to re-cache for next time
      this.preloadInterstitial();
      return false;
    }
  }

  /**
   * Show a Rewarded Video Ad (Highest eCPM)
   * Calls onRewardEarned only when the user completely watches the sponsor video!
   */
  public async showRewardedAd(
    reason: string = 'unlock_premium_perk',
    onRewardEarned?: (rewardType: string, amount: number) => void
  ): Promise<boolean> {
    try {
      if (this.isNative()) {
        if (!this.isRewardedReady) {
          await this.preloadRewarded();
        }

        let rewardClaimed = false;
        const rewardListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
          rewardClaimed = true;
          if (onRewardEarned) {
            onRewardEarned(reward.type || 'divine_blessing', reward.amount || 1);
          }
          rewardListener.remove();
        });

        await AdMob.showRewardVideoAd();
        this.isRewardedReady = false;
        this.preloadRewarded();
        return true;
      } else if (this.hasCustomWebViewBridge()) {
        (window as any).AndroidAdMob.showRewarded?.(reason);
        if (onRewardEarned) onRewardEarned('divine_blessing', 1);
        return true;
      } else {
        // Web preview simulation: Simulate watching the rewarded ad
        console.log(`[AdMob Simulation] Rewarded video played for: "${reason}". Granting perk reward!`);
        if (onRewardEarned) {
          onRewardEarned('divine_blessing', 1);
        }
        return true;
      }
    } catch (err) {
      console.warn('[AdMob] Rewarded video presentation warning:', err);
      this.preloadRewarded();
      return false;
    }
  }
}

export const admobService = new AdMobService();
