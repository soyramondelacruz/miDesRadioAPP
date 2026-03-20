// src/utils/featuredPrograms.ts
import type { Program } from "../data/schedule";
import { programCatalogById, ProgramCatalogItem } from "../data/programCatalog";

type CatalogMap = Record<string, ProgramCatalogItem>;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function getFeaturedProgramsDynamic(opts: {
  count?: number;
  effectiveNow: Date;
  mode?: "day" | "6h";
  excludeIds?: string[];
  fallbackFromSchedule?: Program[];
}): Array<ProgramCatalogItem & { id: string }> {
  const {
    count = 6,
    effectiveNow,
    mode = "day",
    excludeIds = [],
    fallbackFromSchedule = [],
  } = opts;

  const catalog: CatalogMap = (programCatalogById as any) ?? {};

  // 1) Preferir catálogo
  let pool: Array<ProgramCatalogItem & { id: string }> = Object.values(catalog)
    .map((x) => ({
      ...x,
      id: x.id,
    }))
    // ✅ excluir música explícitamente
    .filter((x) => x.kind !== "music");

  // 2) Si no hay suficiente catálogo, usar fallback desde schedule
  if (pool.length < count && fallbackFromSchedule.length) {
    const existingIds = new Set(pool.map((p) => p.id));

    for (const p of fallbackFromSchedule) {
      if (!p?.id) continue;
      if (p.kind !== "show") continue; // ✅ solo programas
      if (existingIds.has(p.id)) continue;

      pool.push({
        id: p.id,
        title: p.title,
        subtitle: p.host,
        description: "Programa de miDes Radio.",
        kind: p.kind,
      });
    }
  }

  // 3) Excluir current + upcoming
  const exclude = new Set(excludeIds.filter(Boolean));
  pool = pool.filter((p) => p?.id && !exclude.has(p.id));

  if (!pool.length) return [];

  // 4) Rotación estable
  const hours = effectiveNow.getHours();
  const day = Math.floor(effectiveNow.getTime() / 86_400_000);
  const block = mode === "6h" ? Math.floor(hours / 6) : 0;
  const seed = day * 10 + block;

  const shuffled = [...pool];
  let s = seed >>> 0;

  function rand() {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  }

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const take = clamp(count, 1, 24);
  return shuffled.slice(0, take);
}