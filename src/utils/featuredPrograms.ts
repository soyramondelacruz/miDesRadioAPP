// src/utils/featuredPrograms.ts
import type { Program } from "../data/schedule";
import { programCatalogById, ProgramCatalogItem } from "../data/programCatalog";

type CatalogMap = Record<string, ProgramCatalogItem>;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

// Seed estable: rota por día (o por bloque de horas si quieres).
// mode = "day" => cambia 1 vez al día
// mode = "6h"  => cambia cada 6 horas
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

  // 1) Construir pool desde catálogo (preferido)
  const catalog: CatalogMap = (programCatalogById as any) ?? {};
  let pool: Array<ProgramCatalogItem & { id: string }> = Object.values(catalog).map((x) => ({
    ...x,
    id: x.id,
  }));

  // 2) Si no hay catálogo, fallback: derivar desde schedule
  if (!pool.length && fallbackFromSchedule.length) {
    const map = new Map<string, ProgramCatalogItem & { id: string }>();
    for (const p of fallbackFromSchedule) {
      if (!p?.id) continue;
      if (!map.has(p.id)) {
        map.set(p.id, {
          id: p.id,
          title: p.title,
          subtitle: p.host,
        });
      }
    }
    pool = Array.from(map.values());
  }

  // 3) Filtrar excluidos
  const exclude = new Set(excludeIds.filter(Boolean));
  pool = pool.filter((p) => p?.id && !exclude.has(p.id));

  if (!pool.length) return [];

  // 4) Seed estable
  const hours = effectiveNow.getHours();
  const day = Math.floor(effectiveNow.getTime() / 86_400_000); // días desde epoch
  const block = mode === "6h" ? Math.floor(hours / 6) : 0;
  const seed = day * 10 + block;

  // 5) Shuffle determinístico (Fisher-Yates con LCG simple)
  const shuffled = [...pool];
  let s = seed >>> 0;
  function rand() {
    // LCG
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