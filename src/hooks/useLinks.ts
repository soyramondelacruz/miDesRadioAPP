import { useEffect, useState } from "react";
import { linksService } from "../services/links.service";
import type { LinksPayload } from "../types/links.types";

export function useLinks() {
  const [links, setLinks] = useState<LinksPayload>({});
  const [loading, setLoading] = useState(true);

  async function load(force = false) {
    const data = await linksService.getLinks(force);
    setLinks(data);
    setLoading(false);
  }

  useEffect(() => {
    load(false);
  }, []);

  return { links, loading, refresh: () => load(true) };
}