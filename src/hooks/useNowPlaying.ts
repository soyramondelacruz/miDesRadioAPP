import { useEffect, useState } from "react";
import type { NowPlayingPayload } from "../types/content.types";
import { contentService } from "../services/content.service";

export function useNowPlaying(pollMs: number = 30000) {
  const [data, setData] = useState<NowPlayingPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const res = await contentService.getNowPlaying();
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando Ahora Sonando.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    load();
    interval = setInterval(load, pollMs);

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollMs]);

  return { data, loading, error, reload: load };
}