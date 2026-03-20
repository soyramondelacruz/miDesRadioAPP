// src/utils/programs.ts
import { Program, weeklySchedule } from "../data/schedule";
import { programCatalogById } from "../data/programCatalog";

export type ResolvedProgram = Program & {
  subtitle?: string;
  description?: string;
  featured?: boolean;
  visualKey?: string;
  dayIndex: number;
  dayLabel: string;
};

const DAY_LABELS: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

export function findProgramById(programId: string): { program: Program; dayIndex: number } | null {
  const entries = Object.entries(weeklySchedule);

  for (const [dayKey, dayPrograms] of entries) {
    const found = dayPrograms.find((p) => p.id === programId);
    if (found) {
      return {
        program: found,
        dayIndex: Number(dayKey),
      };
    }
  }

  return null;
}

export function resolveProgramById(programId: string): ResolvedProgram | null {
  const found = findProgramById(programId);
  if (!found) return null;

  const { program: base, dayIndex } = found;
  const catalog = (programCatalogById as Record<string, any>)[programId];

  return {
    ...base,
    title: catalog?.title ?? base.title,
    host: catalog?.subtitle ?? base.host,
    subtitle: catalog?.subtitle ?? base.host,
    description:
      catalog?.description ??
      (base.kind === "music"
        ? "Bloque musical de miDes Radio."
        : "Programa de contenido dentro de la programación oficial de miDes Radio."),
    featured: !!catalog?.featured,
    visualKey: catalog?.visualKey,
    dayIndex,
    dayLabel: DAY_LABELS[dayIndex] ?? "Día no definido",
  };
}