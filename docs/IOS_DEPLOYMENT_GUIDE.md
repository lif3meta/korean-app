# iOS App Deployment Guide — Expo + Xcode + App Store

Complete guide from React Native/Expo project to App Store, based on the Lzy Learn Korean deployment.

---

## Prerequisites

- macOS with Xcode installed
- Apple Developer Account ($99/year) — https://developer.apple.com/programs/enroll/
- Node.js, npm
- Expo CLI (`npx expo`)
- EAS CLI (`npx eas-cli`) — optional but recommended

---

## 1. Apple Developer Setup

### Create Developer Account
1. Go to https://developer.apple.com/programs/enroll/
2. Sign in with Apple ID > enroll as Individual ($99/year)
3. Wait for approval (usually instant)

### Register Bundle ID
1. Go to https://developer.apple.com/account/resources/identifiers/add/bundleId
2. Select **App IDs** > **App**
3. Enter description and explicit Bundle ID (e.g., `com.hanflow.korean`)
4. Enable capabilities if needed (e.g., Background Modes for audio)
5. Register

### Create App in App Store Connect
1. Go to https://appstoreconnect.apple.com > **Apps** > **+** > **New App**
2. Platform: iOS
3. Name: "Lzy Learn Korean", language, Bundle ID (select from dropdown), SKU
4. Click Create

---

## 2. Prepare the Expo Project

### app.json — Required Fields
```json
{
  "expo": {
    "name": "Lzy Learn Korean",
    "slug": "lzy-learn-korean",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "ios": {
      "bundleIdentifier": "com.hanflow.korean",
      "supportsTablet": true,
      "infoPlist": {
        "NSMicrophoneUsageDescription": "Used for live Korean conversation practice with AI tutors"
      }
    },
    "plugins": ["expo-router", "expo-font"]
  }
}
```

### Icon Requirements
- **1024x1024 PNG** — no transparency, no alpha channel
- Must be actual PNG format (not JPEG renamed to .png)
- Check with: `file assets/icon.png` — should say "PNG image data"
- Convert if needed: `sips -s format png icon.png --out icon-fixed.png`

### eas.json
```json
{
  "build": {
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 3. Generate Native iOS Project

```bash
npx expo prebuild --platform ios --clean
```

This creates the `ios/` directory with Xcode project and installs CocoaPods.

### Common Issues

**"Property X doesn't exist"** — Missing imports in component files. Check theme imports.

**JPEG icon disguised as PNG** — Xcode won't show the icon.
```bash
file assets/icon.png  # Check if it says "JPEG"
sips -s format png assets/icon.png --out fixed.png && mv fixed.png assets/icon.png
npx expo prebuild --platform ios --clean  # Regenerate
```

**expo-av build failure** ("ExpoModulesCore/EXEventEmitter.h not found") — expo-av is deprecated in newer Expo SDKs. Remove it if you don't need native audio recording:
```bash
npm uninstall expo-av
npx expo prebuild --platform ios --clean
```

**Native driver animation errors** — Don't mix `useNativeDriver: true` and `useNativeDriver: false` on the same `Animated.View`. Use the same driver for all animations on one node.

---

## 4. Xcode Setup

### Open Project
```bash
open ios/LzyLearnKorean.xcworkspace  # Always .xcworkspace, NOT .xcodeproj
```

### Configure Signing
1. Select project (blue icon) in navigator > select your target
2. **Signing & Capabilities** tab
3. Check **Automatically manage signing**
4. Select your **Team** (Apple Developer account)
5. If no team: **Xcode > Settings > Accounts > + > Apple ID**

### Add Capabilities (if needed)
1. **Signing & Capabilities** > **+ Capability**
2. Common ones for language/audio apps:
   - **Background Modes** > Audio, AirPlay, and Picture in Picture

### Build Settings
- General > Version: current version, Build: increment
- Minimum Deployments: `iOS 16.0`
- Device: **Any iOS Device (arm64)** — NOT a simulator

---

## 5. Xcode Troubleshooting

### "PIF transfer session" error
```bash
# Quit Xcode, then:
rm -rf ~/Library/Developer/Xcode/DerivedData/LzyLearnKorean-*
rm -rf ios/build
open ios/LzyLearnKorean.xcworkspace
```

### Indexing takes forever
```bash
# Disable indexing temporarily:
defaults write com.apple.dt.Xcode IDEIndexDisable -bool YES
# Re-enable after archiving:
defaults write com.apple.dt.Xcode IDEIndexDisable -bool NO
```

### Clean Build
- **Cmd+Shift+K** (Clean Build Folder)
- Or: `cd ios && xcodebuild clean`

### Test Build Without Signing (check for compilation errors)
```bash
cd ios && xcodebuild -workspace LzyLearnKorean.xcworkspace -scheme LzyLearnKorean \
  -destination "generic/platform=iOS" -configuration Release \
  CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO build 2>&1 \
  | grep -E "error:|BUILD SUCCEEDED|BUILD FAILED"
```

---

## 6. Build Archive

1. In Xcode, set device to **Any iOS Device (arm64)**
2. **Product > Archive**
3. Wait 2-10 minutes
4. Organizer window opens

---

## 7. Upload to App Store Connect

1. In Organizer, select archive
2. **Distribute App** > **App Store Connect** > **Upload**
3. Leave defaults > Next > Select signing cert > Upload
4. Wait 2-5 minutes

### dSYM Warnings
"Upload Symbols Failed" warnings for React.framework, hermesvm.framework, etc. are **safe to ignore**. These are React Native internal frameworks — the upload still succeeds.

---

## 8. App Store Connect Metadata

### Required Fields
| Field | Example |
|---|---|
| App Name | Lzy Learn Korean |
| Subtitle | Master Korean the Fun & Lazy Way |
| Category | Education |
| Secondary Category | Lifestyle |
| Description | Full description (up to 4000 chars) |
| Keywords | comma,separated,100chars,max |
| Support URL | https://ulbmedia.com/support |
| Privacy Policy URL | https://ulbmedia.com/privacy |
| Age Rating | 4+ (no objectionable content) |

### Screenshots
- Minimum: **6.7" display** (iPhone 15 Pro Max — 1290x2796)
- Take in Simulator: **Cmd+S** saves to Desktop
- 4-10 screenshots per device size
- Add captions for each

### App Privacy
- If using third-party AI APIs: "Usage Data" > "Not Linked to User"
- If purchases stay on-device with StoreKit and are not sent to your servers, review whether "Purchases" needs to be declared at all based on your actual data flow.

### In-App Purchases
- Configure subscription product in App Store Connect
- Premium tier: AI voice chat (100 min/month), AI quizzes, free writing with AI feedback
- 3-day free trial

### Build
- Click **+** next to Build section
- Select uploaded build (takes 10-30 min to process after upload)
- Build appears in **TestFlight** tab first

---

## 9. Submit for Review

1. Fill all required fields in **Prepare for Submission**
2. **App Review Information**: contact name, email, phone
3. Notes for reviewer:
   - AI teacher chat requires internet access
   - Microphone used for live Korean conversation practice
   - Premium features available via subscription with 3-day free trial
4. **Add for Review** > **Submit to App Review**
5. Review takes 24-48 hours

---

## Alternative: EAS Build (Skip Xcode)

EAS builds in the cloud — no Xcode indexing or local builds needed.

```bash
# Login
npx eas-cli login

# Build for App Store
npx eas-cli build --platform ios --profile production

# Submit to App Store Connect
npx eas-cli submit --platform ios
```

EAS manages certificates, provisioning profiles, and builds automatically. Free tier: 1 build/month.

---

## Quick Reference

| Command | What it does |
|---|---|
| `npx expo prebuild --platform ios --clean` | Generate/regenerate iOS project |
| `cd ios && pod install` | Reinstall CocoaPods |
| `open ios/LzyLearnKorean.xcworkspace` | Open in Xcode |
| `npx eas-cli build --platform ios` | Cloud build via EAS |
| `npx eas-cli submit --platform ios` | Submit to App Store via EAS |
| `xcrun simctl screenshot booted screenshot.png` | Take simulator screenshot |

---

## Checklist Before Submission

- [ ] Icon is 1024x1024 real PNG (no alpha)
- [ ] Bundle ID matches App Store Connect
- [ ] Version and build number set
- [ ] Signing team selected
- [ ] Archive builds successfully
- [ ] Screenshots uploaded (6.7" minimum, 4-10 per size)
- [ ] Description, keywords, URLs filled
- [ ] Privacy policy URL set
- [ ] Age rating completed
- [ ] App privacy questionnaire done
- [ ] In-app purchase / subscription configured
- [ ] Build selected in submission
- [ ] Backend routes accessible (health, chat-speech, gemini-live-token)
- [ ] Review notes mention internet requirement and mic usage
