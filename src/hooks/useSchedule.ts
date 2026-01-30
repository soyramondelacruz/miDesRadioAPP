import { useEffect, useState } from "react";
import type { SchedulePayload } from "../types/content.types";
import type { DataSource } from "../types/remote.types";
import { contentService } from "../services/content.service";

export function useSchedule() {
  const [data, setData] = useState<SchedulePayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<DataSource | null>(null);

  async function load(forceRefresh: boolean = false) {
    try {
      setError(null);

      const res = await contentService.getSchedule({ forceRefresh });
      setData(res);
      setSource(contentService.getLastScheduleSource());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando programación.");
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
    load(false);
  }, []);

  return { data, loading, refreshing, error, source, reload: () => load(true), refresh };
}