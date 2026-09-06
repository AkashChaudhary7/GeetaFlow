#!/bin/bash
# Script to build and sign Android App Bundle (.aab) locally via terminal
set -e

echo "=== 1. Building Web Assets & Syncing Android ==="
npm run build
npx cap sync android

echo "=== 2. Building Release AAB with Gradle ==="
cd android
chmod +x ./gradlew
./gradlew bundleRelease --no-daemon

AAB_PATH="app/build/outputs/bundle/release"
echo "=== 3. Build Finished Successfully! ==="
echo "Your AAB is located at: android/$AAB_PATH/app-release.aab"
echo ""
echo "To sign this AAB using jarsigner via terminal:"
echo "jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore YOUR_KEYSTORE.jks android/$AAB_PATH/app-release.aab YOUR_KEY_ALIAS"
