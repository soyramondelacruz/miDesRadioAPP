import { useEffect, useState } from "react";
import type { NowPlayingPayload } from "../types/content.types";
import type { DataSource } from "../types/remote.types";
import { contentService } from "../services/content.service";

export function useNowPlaying(pollMs: number = 30000) {
  const [data, setData] = useState<NowPlayingPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<DataSource | null>(null);

  async function load(forceRefresh: boolean = false) {
    try {
      setError(null);

      const res = await contentService.getNowPlaying({ forceRefresh });
      setData(res);
      setSource(contentService.getLastNowPlayingSource());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando Ahora Sonando.");
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    load(false);
    interval = setInterval(() => load(false), pollMs);

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollMs]);

  return { data, loading, refreshing, error, source, reload: () => load(true), refresh };
}