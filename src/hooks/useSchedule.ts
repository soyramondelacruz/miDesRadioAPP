import { useEffect, useState } from "react";
import type { SchedulePayload } from "../types/content.types";
import { contentService } from "../services/content.service";

export function useSchedule() {
  const [data, setData] = useState<SchedulePayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const res = await contentService.getSchedule();
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando programación.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { data, loading, error, reload: load };
}