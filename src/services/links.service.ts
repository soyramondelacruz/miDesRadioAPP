import { LINKS_CONFIG } from "../config/links.config";
import { fetchJsonWithTimeout } from "../utils/fetchJsonWithTimeout";
import type { LinksPayload } from "../types/links.types";

const LOCAL_LINKS: LinksPayload = {
  // Core
  whatsapp: "https://wa.me/18099779515",
  youtube: "https://www.youtube.com/@midesradio",
  instagram: "https://www.instagram.com/midesradio",
  facebook: "https://www.facebook.com/midesradio",

  // CTAs WhatsApp (fallback local)
  whatsapp_prayer: {
    url: "https://wa.me/18099779515",
    message: "Hola miDes Radio 🙏 Quiero pedir oración por: ",
  },
  whatsapp_greeting: {
    url: "https://wa.me/18099779515",
    message: "Hola miDes Radio 👋 Quiero enviar un saludo al aire para: ",
  },
  whatsapp_song: {
    url: "https://wa.me/18099779515",
    message: "Hola miDes Radio 🎶 Quisiera solicitar esta canción: ",
  },
  whatsapp_testimony: {
    url: "https://wa.me/18099779515",
    message: "Hola miDes Radio ✨ Quiero compartir un testimonio: ",
  },
};

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

class LinksService {
  private cache: CacheEntry<LinksPayload> | null = null;

  private isFresh() {
    return !!this.cache && Date.now() < this.cache.expiresAt;
  }

  async getLinks(forceRefresh = false): Promise<LinksPayload> {
    if (!forceRefresh && this.isFresh()) {
      return this.cache!.data;
    }

    if (LINKS_CONFIG.enabled) {
      const url = LINKS_CONFIG.endpoints.links;
      if (url && url.startsWith("https://")) {
        try {
          const remote = await fetchJsonWithTimeout<LinksPayload>(
            url,
            LINKS_CONFIG.requestTimeoutMs
          );
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
      data: LOCAL_LINKS,
      expiresAt: Date.now() + LINKS_CONFIG.cacheTtlMs,
    };
    return LOCAL_LINKS;
  }
}

export const linksService = new LinksService();