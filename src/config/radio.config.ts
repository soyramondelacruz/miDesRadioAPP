export const RADIO_CONFIG = {
  APP_NAME: "miDes Radio",
  STREAM_URL: "https://ice5.somafm.com/groovesalad-128-mp3",
  RECONNECT: {
    MAX_ATTEMPTS: 5,
    BASE_DELAY_MS: 1200,
  },
} as const;