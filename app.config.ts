import type { ExpoConfig } from 'expo/config';

const appJson = require('./app.json');

const config: ExpoConfig = {
  ...appJson.expo,
  extra: {
    ...(appJson.expo.extra ?? {}),
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8787',
  },
};

export default config;
