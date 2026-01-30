import type { NowPlayingPayload, SchedulePayload } from "../types/content.types";
import { REMOTE_CONFIG } from "../config/remote.config";
import { fetchJsonWithTimeout } from "../utils/fetchJsonWithTimeout";

// Fallback local (mock). Se mantiene como "última línea de defensa".
import nowPlayingLocal from "../../now-playing.json";
import scheduleLocal from "../../schedule.json";

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

class ContentService {
  private nowPlayingCache: CacheEntry<NowPlayingPayload> | null = null;
  private scheduleCache: CacheEntry<SchedulePayload> | null = null;

  private isFresh(entry: CacheEntry<any> | null): boolean {
    return !!entry && Date.now() < entry.expiresAt;
  }

  private setCache<T>(setter: (v: CacheEntry<T>) => void, data: T) {
    setter({
      data,
      expiresAt: Date.now() + REMOTE_CONFIG.cacheTtlMs,
    });
  }

  async getNowPlaying(): Promise<NowPlayingPayload> {
    if (this.isFresh(this.nowPlayingCache)) {
      return this.nowPlayingCache!.data;
    }

    // Remote-first con fallback local
    if (REMOTE_CONFIG.enabled) {
      const url = REMOTE_CONFIG.endpoints.nowPlaying;

      // Si el usuario aún no puso URL real, caerá a local.
      if (url && url.startsWith("https://")) {
        try {
          const remote = await fetchJsonWithTimeout<NowPlayingPayload>(
            url,
            REMOTE_CONFIG.requestTimeoutMs
          );

          this.setCache((v) => (this.nowPlayingCache = v), remote);
          return remote;
        } catch {
          // silencioso: seguimos con local (MVP estable)
        }
      }
    }

    const local = nowPlayingLocal as NowPlayingPayload;
    this.setCache((v) => (this.nowPlayingCache = v), local);
    return local;
  }

  async getSchedule(): Promise<SchedulePayload> {
    if (this.isFresh(this.scheduleCache)) {
      return this.scheduleCache!.data;
    }

    if (REMOTE_CONFIG.enabled) {
      const url = REMOTE_CONFIG.endpoints.schedule;

      if (url && url.startsWith("https://")) {
        try {
          const remote = await fetchJsonWithTimeout<SchedulePayload>(
            url,
            REMOTE_CONFIG.requestTimeoutMs
          );

          this.setCache((v) => (this.scheduleCache = v), remote);
          return remote;
        } catch {
          // fallback local
        }
      }
    }

    const local = scheduleLocal as SchedulePayload;
    this.setCache((v) => (this.scheduleCache = v), local);
    return local;
  }
}

export const contentService = new ContentService();