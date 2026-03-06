// src/utils/programs.ts
import { Program, weeklySchedule } from "../data/schedule";
import { programCatalogById } from "../data/programCatalog";

export type ResolvedProgram = Program & {
  subtitle?: string;
  description?: string;
  featured?: boolean;
  visualKey?: string;
};

export function findProgramById(programId: string): Program | null {
  const days = Object.values(weeklySchedule);

  for (const dayPrograms of days) {
    const found = dayPrograms.find((p) => p.id === programId);
    if (found) return found;
  }

  return null;
}

export function resolveProgramById(programId: string): ResolvedProgram | null {
  const base = findProgramById(programId);
  if (!base) return null;

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
  };
}