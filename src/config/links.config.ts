export const LINKS_CONFIG = {
  enabled: true,

  endpoints: {
    links: "https://TU-DOMINIO/links.json",
  },

  requestTimeoutMs: 5000,
  cacheTtlMs: 60_000,
} as const;