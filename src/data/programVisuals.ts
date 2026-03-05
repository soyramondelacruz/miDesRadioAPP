// src/data/programVisuals.ts
import type { Program } from "./schedule";

// ✅ Default
export const DEFAULT_ARTWORK = require("../../assets/artwork.jpg");

// ✅ Categorías (estables)
export const programCategoryArtworks = {
  music: require("../../assets/programs/musica.jpg"),
  prayer: require("../../assets/programs/oracion.jpg"),
  news: require("../../assets/programs/noticias.jpg"),
  message: require("../../assets/programs/mensaje.jpg"),
  postrecito: require("../../assets/programs/postrecito.jpg"),
  // OJO: este archivo debe existir exactamente con este nombre
  psychology: require("../../assets/programs/psicologia-fe.jpg"),
} as const;

export type ProgramCategoryKey = keyof typeof programCategoryArtworks;

// ✅ Programas especiales por ID (cuando tengas algo único)
export const programSpecialArtworksById: Record<string, any> = {
  // "wk-1800-estudio-biblico": require("../../assets/programs/estudio-biblico.jpg"),
  // "special-semana-santa": require("../../assets/programs/semana-santa.jpg"),
};

// ✅ Resolución final (1 sola función para toda la app)
export function getProgramVisuals(program?: Program | null): {
  artwork: any;
  category: ProgramCategoryKey | "default";
} {
  if (!program) return { artwork: DEFAULT_ARTWORK, category: "default" };

  // 1) Especial por ID
  const special = programSpecialArtworksById[program.id];
  if (special) return { artwork: special, category: "default" };

  // 2) Si tu Program trae un campo opcional `visualKey`, úsalo:
  const visualKey = (program as any).visualKey as ProgramCategoryKey | undefined;
  if (visualKey && programCategoryArtworks[visualKey]) {
    return { artwork: programCategoryArtworks[visualKey], category: visualKey };
  }

  // 3) Inferencia por título (v1)
  const t = (program.title || "").toLowerCase();

  if (t.includes("oración") || t.includes("orando") || t.includes("clamar")) {
    return { artwork: programCategoryArtworks.prayer, category: "prayer" };
  }

  if (t.includes("noticia")) {
    return { artwork: programCategoryArtworks.news, category: "news" };
  }

  if (t.includes("mensaje") || t.includes("predica") || t.includes("predicación")) {
    return { artwork: programCategoryArtworks.message, category: "message" };
  }

  if (t.includes("postrecito")) {
    return { artwork: programCategoryArtworks.postrecito, category: "postrecito" };
  }

  if (t.includes("psicolog")) {
    return { artwork: programCategoryArtworks.psychology, category: "psychology" };
  }

  // 4) Default
  return { artwork: programCategoryArtworks.music ?? DEFAULT_ARTWORK, category: "music" };
}