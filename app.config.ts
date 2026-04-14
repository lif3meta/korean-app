import type { ExpoConfig } from 'expo/config';

const appJson = require('./app.json');
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? appJson.expo.extra?.apiBaseUrl ?? null;

const config: ExpoConfig = {
  ...appJson.expo,
  extra: {
    ...(appJson.expo.extra ?? {}),
    apiBaseUrl,
  },
};

export default config;
