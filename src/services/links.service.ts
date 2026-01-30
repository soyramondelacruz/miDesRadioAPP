import { LINKS_CONFIG } from "../config/links.config";
import { fetchJsonWithTimeout } from "../utils/fetchJsonWithTimeout";

type LinksPayload = {
  whatsapp?: string;
  youtube?: string;
  instagram?: string;
  facebook?: string;
};

const LOCAL_LINKS: LinksPayload = {
  whatsapp: "https://wa.me/18099779515",
  youtube: "https://www.youtube.com",
  instagram: "https://www.instagram.com/midesradio",
 
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