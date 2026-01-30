import type { NowPlayingPayload, SchedulePayload } from "../types/content.types";
import type { DataSource } from "../types/remote.types";
import { REMOTE_CONFIG } from "../config/remote.config";
import { fetchJsonWithTimeout } from "../utils/fetchJsonWithTimeout";

import nowPlayingLocal from "../../now-playing.json";
import scheduleLocal from "../../schedule.json";

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

type GetOptions = {
  forceRefresh?: boolean; // ignora cache TTL
};

class ContentService {
  private nowPlayingCache: CacheEntry<NowPlayingPayload> | null = null;
  private scheduleCache: CacheEntry<SchedulePayload> | null = null;

  private lastNowPlayingSource: DataSource | null = null;
  private lastScheduleSource: DataSource | null = null;

  getLastNowPlayingSource(): DataSource | null {
    return this.lastNowPlayingSource;
  }

  getLastScheduleSource(): DataSource | null {
    return this.lastScheduleSource;
  }

  private isFresh(entry: CacheEntry<any> | null): boolean {
    return !!entry && Date.now() < entry.expiresAt;
  }

  private setCache<T>(setter: (v: CacheEntry<T>) => void, data: T) {
    setter({
      data,
      expiresAt: Date.now() + REMOTE_CONFIG.cacheTtlMs,
    });
  }

  async getNowPlaying(options: GetOptions = {}): Promise<NowPlayingPayload> {
    const { forceRefresh = false } = options;

    if (!forceRefresh && this.isFresh(this.nowPlayingCache)) {
      return this.nowPlayingCache!.data;
    }

    // Remote-first con fallback local
    if (REMOTE_CONFIG.enabled) {
      const url = REMOTE_CONFIG.endpoints.nowPlaying;

      if (url && url.startsWith("https://")) {
        try {
          const remote = await fetchJsonWithTimeout<NowPlayingPayload>(
            url,
            REMOTE_CONFIG.requestTimeoutMs
          );

          this.lastNowPlayingSource = "remote";
          this.setCache((v) => (this.nowPlayingCache = v), remote);
          return remote;
        } catch {
          // fallback local
        }
      }
    }

    const local = nowPlayingLocal as NowPlayingPayload;
    this.lastNowPlayingSource = "local";
    this.setCache((v) => (this.nowPlayingCache = v), local);
    return local;
  }

  async getSchedule(options: GetOptions = {}): Promise<SchedulePayload> {
    const { forceRefresh = false } = options;

    if (!forceRefresh && this.isFresh(this.scheduleCache)) {
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

          this.lastScheduleSource = "remote";
          this.setCache((v) => (this.scheduleCache = v), remote);
          return remote;
        } catch {
          // fallback local
        }
      }
    }

    const local = scheduleLocal as SchedulePayload;
    this.lastScheduleSource = "local";
    this.setCache((v) => (this.scheduleCache = v), local);
    return local;
  }
}

export const contentService = new ContentService();