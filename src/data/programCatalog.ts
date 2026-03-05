// src/data/programCatalog.ts
import { ProgramVisualKey } from "./programVisuals";

export type ProgramCatalogItem = {
  id: string;
  title: string;
  subtitle?: string; // host / tagline corto
  description?: string;
  visualKey?: ProgramVisualKey; // music/devotional/news/etc
  featured?: boolean; // para “Destacados”
};

export const programCatalogById: Record<string, ProgramCatalogItem> = {
  // EJEMPLOS — AJUSTA IDs A LOS TUYOS REALES EN weeklySchedule
  "mon-prayer": {
    id: "mon-prayer",
    title: "Orando al Alba",
    subtitle: "Oración • Inicio del día",
    description: "Un espacio de oración para comenzar el día con fe y enfoque.",
    visualKey: "devotional",
    featured: true,
  },
  "mon-music": {
    id: "mon-music",
    title: "Música Inspiradora",
    subtitle: "Adoración • Instrumental",
    description: "Selección musical para acompañar tu jornada con paz.",
    visualKey: "music",
    featured: true,
  },
  "mon-evening": {
    id: "mon-evening",
    title: "Reflexión de la Tarde",
    subtitle: "Mensaje • Enseñanza",
    description: "Reflexiones cortas para fortalecer tu caminar.",
    visualKey: "teaching",
    featured: true,
  },
};