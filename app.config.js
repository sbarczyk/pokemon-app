const { expo } = require('./app.json');

// For the map to work on Android, set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY (e.g. in .env).
// Enable "Maps SDK for Android" in Google Cloud Console for this key.
module.exports = () => ({
  ...expo,
  android: {
    ...expo.android,
    config: {
      ...expo.android?.config,
      googleMaps: {
        ...(expo.android?.config?.googleMaps ?? {}),
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
      },
    },
  },
});
