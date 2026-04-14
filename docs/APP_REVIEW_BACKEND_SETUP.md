# App Review Backend Setup

To let App Review test the AI teacher chat and premium features fully, the review build must talk to a public HTTPS backend.

## Required backend routes

Deploy the `api/` folder to your public backend or serverless platform so these routes are reachable:

- `/api/health`
- `/api/chat-speech`
- `/api/gemini-live-token`

The Gemini Live chat (AI tutors Minji & Junwoo) depends on `/api/gemini-live-token`.

## Required environment variables

Set these on the deployed backend:

- `GEMINI_API_KEY`

Set this in the Expo build environment for the review build:

- `EXPO_PUBLIC_API_BASE_URL=https://your-public-backend.example.com`

## Review build requirement

Do not submit a build that points to `127.0.0.1` or a LAN IP. App Review devices cannot reach your local machine.

Review and production builds must resolve `apiBaseUrl` to a public HTTPS endpoint, either from `EXPO_PUBLIC_API_BASE_URL` or the checked-in default in `app.json`.

## Native Apple subscription testing

If the review build includes premium features (AI voice chat extended minutes, AI-generated quizzes, free writing with AI feedback), ensure:

1. The Account Holder has accepted the Paid Apps Agreement in App Store Connect.
2. The subscription product `com.hanflow.korean.premium.monthly` exists in App Store Connect for `com.hanflow.korean`, has pricing/availability configured, and is in a reviewable state.
3. A sandbox Apple test account is configured in App Store Connect and can complete the subscription flow on a physical iPhone or TestFlight build.
4. Any introductory offer configured in App Store Connect matches the copy shown in the app and review notes.

## Recommended pre-review check

Before submitting, verify:

1. `GET https://your-public-backend.example.com/api/health` returns `200`.
2. `GET https://your-public-backend.example.com/api/gemini-live-token` returns JSON with `token`.
3. A TestFlight build using that same `EXPO_PUBLIC_API_BASE_URL` can open chat, send typed messages, and use the microphone.
4. Subscription flow works end-to-end in sandbox environment.
5. The paywall loads a real App Store price before you tap the subscribe button.

## App Review note

In App Store Connect review notes, mention:

- AI teacher chat requires internet access
- microphone access is used for live Korean conversation practice with AI tutors
- the app name is "Lzy Learn Korean"
- premium features available via in-app subscription with 3-day free trial
- no login is required for free features
