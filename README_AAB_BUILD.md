# GeetaFlow — Google Play .AAB (Android App Bundle) & AdMob Release Guide

This project is fully configured for Google AdMob monetization and Google Play `.aab` (Android App Bundle) generation using **Capacitor 7** & `@capacitor-community/admob`.

---

## 🚀 Quick Start: Generate `.aab` in 4 Steps

### Step 1: Build the Web Assets
On your local machine with Node.js installed:
```bash
npm install
npm run build
```
This generates the optimized production bundle inside the `dist/` folder.

---

### Step 2: Initialize Android Platform & Sync
Add the native Android project (one-time setup):
```bash
npx cap add android
npx cap sync android
```
This creates the complete native Android project in the `/android` directory.

---

### Step 3: Set Your Google AdMob App ID in AndroidManifest.xml
Open `android/app/src/main/AndroidManifest.xml` and ensure your AdMob App ID is declared inside the `<application>` tag:

```xml
<application ...>
    <!-- Google AdMob Android App ID -->
    <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ca-app-pub-3940256099942544~3347511713"/> <!-- Replace with your live AdMob App ID -->
    ...
</application>
```

*(Note: While developing and testing, you can keep the test ID `ca-app-pub-3940256099942544~3347511713` so your Google AdMob account is not flagged for invalid impressions).*

---

### Step 4: Open in Android Studio & Generate `.aab`
Run:
```bash
npx cap open android
```
This launches Android Studio:
1. Wait for Gradle Sync to complete.
2. In the top menu bar, click:
   **Build** ➔ **Generate Signed Bundle / APK...**
3. Select **Android App Bundle (.aab)** and click **Next**.
4. Choose your Keystore (or click *Create new...* to generate your release `.jks` keystore).
5. Select **release** build variant and click **Finish**.
6. Android Studio will generate the signed `.aab` file located at:
   `android/app/release/app-release.aab`

You can now directly upload this `app-release.aab` file to **Google Play Console**!

---

## 🤖 Automated Signed .AAB Build via GitHub Actions

A continuous integration workflow is configured in `.github/workflows/build-aab.yml`.

### Step 1: Generate Release Keystore (if you don't already have one)
Run in your terminal:
```bash
keytool -genkey -v -keystore release.keystore -alias geetaflow -keyalg RSA -keysize 2048 -validity 10000
```

### Step 2: Convert Keystore to Base64
```bash
# On Linux / macOS / Git Bash:
base64 -w 0 release.keystore > keystore_base64.txt
# (or on macOS: base64 -i release.keystore -o keystore_base64.txt)
```

### Step 3: Add Secrets to Your GitHub Repository
1. In your GitHub repository, go to **Settings** ➔ **Secrets and variables** ➔ **Actions**.
2. Click **New repository secret** and add the following:

| Secret Name | Description |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | The entire base64 string from `keystore_base64.txt` |
| `KEYSTORE_PASSWORD` | Password created for the keystore file |
| `KEY_ALIAS` | Key alias (e.g., `geetaflow`) |
| `KEY_PASSWORD` | Key alias password |

### Step 4: Run the Build
- Push changes to `main`/`master` or go to **Actions** ➔ **Build & Sign Android App Bundle (AAB)** ➔ **Run workflow**.
- When the job completes, download the **`app-release-signed-aab`** artifact zip containing your production-ready `.aab` for Google Play Console!

---

## 💰 AdMob Placements Configured in Code

| Ad Format | Placement | eCPM Range | How it triggers |
|---|---|---|---|
| **Adaptive Banner** | Bottom edge (`BOTTOM_CENTER`, 56dp margin) | $0.80 – $2.50 | Automatically loaded on non-premium users without obstructing navigation tabs |
| **Interstitial Ad** | Video Reel Download & Milestone Reading | $4.00 – $12.00 | Triggers when the user saves a 30s video reel or after every 8-10 shlokas (with 90s minimum frequency cap) |
| **Rewarded Video** | HD/4K Export Unlock or Ad-free Reading Perk | $15.00 – $35.00 | User opts in: watches a short video in exchange for high-definition export or temporary ad-free reading |

---

## ⚙️ Environment Variables (Optional)

You can specify your AdMob IDs in `.env`:
```env
VITE_ADMOB_ANDROID_APP_ID="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
VITE_ADMOB_BANNER_ID="ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
VITE_ADMOB_INTERSTITIAL_ID="ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
VITE_ADMOB_REWARDED_ID="ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
```
Or configure them dynamically in the app under:
**Settings ➔ Google AdMob & AAB Monetization Center**.
