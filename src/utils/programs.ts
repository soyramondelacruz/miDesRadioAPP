// src/utils/programs.ts
import { weeklySchedule, Program } from "../data/schedule";
import { programCatalogById } from "../data/programCatalog";

type ResolvedProgram = Program & {
  dayIndex: number;
  dayLabel: string;
  subtitle?: string;
  description?: string;
  visualKey?: string;
  featured?: boolean;
  episodes?: {
    enabled: boolean;
  };
};

const DAY_LABELS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function flattenSchedule(): Array<Program & { dayIndex: number; dayLabel: string }> {
  const result: Array<Program & { dayIndex: number; dayLabel: string }> = [];

  for (const [dayKey, programs] of Object.entries(weeklySchedule)) {
    const dayIndex = Number(dayKey);
    const dayLabel = DAY_LABELS[dayIndex] ?? "Día";

    for (const program of programs) {
      result.push({
        ...program,
        dayIndex,
        dayLabel,
      });
    }
  }

  return result;
}

function mergeWithCatalog(
  scheduleProgram: Program & { dayIndex: number; dayLabel: string }
): ResolvedProgram {
  const catalogKey = scheduleProgram.catalogId ?? scheduleProgram.id;
  const catalog = programCatalogById[catalogKey];

  return {
    ...scheduleProgram,
    title: catalog?.title ?? scheduleProgram.title,
    subtitle: catalog?.subtitle ?? scheduleProgram.host,
    description:
      catalog?.description ??
      "Contenido de miDes Radio diseñado para edificar, acompañar y conectar con la audiencia.",
    visualKey: catalog?.visualKey,
    featured: catalog?.featured ?? false,
    episodes: catalog?.episodes,
  };
}

export function resolveProgramById(programId: string): ResolvedProgram | null {
  const allPrograms = flattenSchedule();

  const directMatch = allPrograms.find((program) => program.id === programId);
  if (directMatch) {
    return mergeWithCatalog(directMatch);
  }

  const catalogMatch = allPrograms.find((program) => program.catalogId === programId);
  if (catalogMatch) {
    return mergeWithCatalog(catalogMatch);
  }

  return null;
}

export function getProgramsByCatalogId(catalogId: string): ResolvedProgram[] {
  const allPrograms = flattenSchedule();

  return allPrograms
    .filter((program) => program.catalogId === catalogId)
    .map(mergeWithCatalog);
}