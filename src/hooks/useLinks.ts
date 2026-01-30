import { useEffect, useState } from "react";
import { linksService } from "../services/links.service";
import type { LinksPayloadV2 } from "../types/links.types";

export function useLinks() {
  const [data, setData] = useState<LinksPayloadV2 | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(force = false) {
    const res = await linksService.getLinks(force);
    setData(res);
    setLoading(false);
  }

  useEffect(() => {
    load(false);
  }, []);

  return { data, loading, refresh: () => load(true) };
}