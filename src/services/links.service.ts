import { LINKS_CONFIG } from "../config/links.config";
import { fetchJsonWithTimeout } from "../utils/fetchJsonWithTimeout";
import type { LinksPayload, LinksPayloadV2, LinksMap, LinkAction } from "../types/links.types";

const LOCAL_LINKS_V2: LinksPayloadV2 = {
  links: {
    // Core
    whatsapp: "https://wa.me/18298285021",
    youtube: "https://www.youtube.com/@midesradio",
    instagram: "https://www.instagram.com/midesradio",
    facebook: "https://www.facebook.com/midesradio",

    // CTAs WhatsApp
    whatsapp_prayer: {
      url: "https://wa.me/18298285021",
      message: "Hola miDes Radio 🙏 Quiero pedir oración por: ",
    },
    whatsapp_greeting: {
      url: "https://wa.me/18298285021",
      message: "Hola miDes Radio 👋 Quiero enviar un saludo al aire para: ",
    },
    whatsapp_song: {
      url: "https://wa.me/18298285021",
      message: "Hola miDes Radio 🎶 Quisiera solicitar esta canción: ",
    },
    whatsapp_testimony: {
      url: "https://wa.me/18298285021",
      message: "Hola miDes Radio ✨ Quiero compartir un testimonio: ",
    },
  },

  actions: [
    { key: "whatsapp", label: "💬 WhatsApp", section: "primary", order: 10 },
    { key: "whatsapp_prayer", label: "🙏 Pedir oración", section: "quick", order: 10, isWhatsApp: true },
    { key: "whatsapp_greeting", label: "👋 Saludar al aire", section: "quick", order: 20, isWhatsApp: true },
    { key: "whatsapp_song", label: "🎶 Solicitar canción", section: "quick", order: 30, isWhatsApp: true },
    { key: "whatsapp_testimony", label: "✨ Enviar testimonio", section: "quick", order: 40, isWhatsApp: true },
    { key: "youtube", label: "▶️ YouTube", section: "social", order: 10 },
    { key: "instagram", label: "📸 Instagram", section: "social", order: 20 },
    { key: "facebook", label: "📘 Facebook", section: "social", order: 30 },
  ],
};

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

function normalizePayload(payload: LinksPayload): LinksPayloadV2 {
  // v2: { links, actions }
  if (payload && typeof payload === "object" && "links" in payload) {
    const v2 = payload as LinksPayloadV2;
    return {
      links: (v2.links ?? {}) as LinksMap,
      actions: v2.actions ?? [],
    };
  }

  // v1: mapa directo { whatsapp: "...", youtube: "...", ... }
  const v1 = payload as LinksMap;
  return { links: v1, actions: [] };
}

class LinksService {
  private cache: CacheEntry<LinksPayloadV2> | null = null;

  private isFresh() {
    return !!this.cache && Date.now() < this.cache.expiresAt;
  }

  async getLinks(forceRefresh = false): Promise<LinksPayloadV2> {
    if (!forceRefresh && this.isFresh()) {
      return this.cache!.data;
    }

    if (LINKS_CONFIG.enabled) {
      const url = LINKS_CONFIG.endpoints.links;
      if (url && url.startsWith("https://")) {
        try {
          const remoteRaw = await fetchJsonWithTimeout<LinksPayload>(
            url,
            LINKS_CONFIG.requestTimeoutMs
          );
          const remote = normalizePayload(remoteRaw);

          this.cache = {
            data: remote,
            expiresAt: Date.now() + LINKS_CONFIG.cacheTtlMs,
          };
          return remote;
        } catch {
          // fallback
        }
      }
    }

    this.cache = {
      data: LOCAL_LINKS_V2,
      expiresAt: Date.now() + LINKS_CONFIG.cacheTtlMs,
    };
    return LOCAL_LINKS_V2;
  }
}

export const linksService = new LinksService();