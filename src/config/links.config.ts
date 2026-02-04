export const LINKS_CONFIG = {
  enabled: true,

  endpoints: {
    links: "https://mides-radio-config1.vercel.app/links.json",
  },

  requestTimeoutMs: 5000,
  cacheTtlMs: 60_000,
} as const;