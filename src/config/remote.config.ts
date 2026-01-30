export const REMOTE_CONFIG = {
  enabled: true,

  // Coloca aquí tus URLs reales cuando las tengas publicadas.
  // Recomendación: servirlos por HTTPS (Cloudflare, Vercel, GitHub Pages, S3, etc.)
  endpoints: {
    nowPlaying: "https://TU-DOMINIO/now-playing.json",
    schedule: "https://TU-DOMINIO/schedule.json",
  },

  // Evita que la app se “quede pensando” si la red está lenta
  requestTimeoutMs: 5000,

  // Cache en memoria (sin AsyncStorage, sin deps)
  cacheTtlMs: 60_000, // 1 minuto
} as const;