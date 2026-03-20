// src/data/programVisuals.ts
import type { Program } from "./schedule";

// ✅ Default
export const DEFAULT_ARTWORK = require("../../assets/artwork.jpg");

// ✅ Categorías estables
export const programCategoryArtworks = {
  music: require("../../assets/programs/mides-musica.jpg"),
  prayer: require("../../assets/programs/mides-oracion.jpg"),
  news: require("../../assets/programs/noticias.jpg"),
  message: require("../../assets/programs/mensaje.jpg"),
  postrecito: require("../../assets/programs/postrecito.jpg"),
  psychology: require("../../assets/programs/psicologia-fe.jpg"),

  // ⚠️ Temporalmente apunta al default hasta que tengas el arte final
  // Cuando crees el archivo real, reemplázalo por:

   teaching: require("../../assets/programs/ensenanza.jpg"),
  
} as const;

export type ProgramCategoryKey = keyof typeof programCategoryArtworks;

// ✅ Overrides personalizados
// Puedes usar:
// - el catalogId (recomendado para familias/editorial)
// - o el id del bloque específico
export const programArtworkOverrides: Record<string, any> = {
  // Ejemplos:
  // "tiempos-oracion": require("../../assets/programs/tiempos-oracion.jpg"),
  // "tue-1200-hola-mujer": require("../../assets/programs/hola-mujer.jpg"),
  // "tue-1800-arranca-fa": require("../../assets/programs/arranca-fa.jpg"),
};

// ✅ Resolución final
export function getProgramVisuals(program?: Program | null): {
  artwork: any;
  category: ProgramCategoryKey | "default";
} {
  if (!program) {
    return { artwork: DEFAULT_ARTWORK, category: "default" };
  }

  const catalogId = (program as any).catalogId as string | undefined;
  const visualKey = (program as any).visualKey as ProgramCategoryKey | undefined;

  // 🥇 1. Override por catalogId
  if (catalogId && programArtworkOverrides[catalogId]) {
    return {
      artwork: programArtworkOverrides[catalogId],
      category: "default",
    };
  }

  // 🥈 2. Override por id del bloque
  if (programArtworkOverrides[program.id]) {
    return {
      artwork: programArtworkOverrides[program.id],
      category: "default",
    };
  }

  // 🥉 3. VisualKey
  if (visualKey && programCategoryArtworks[visualKey]) {
    return {
      artwork: programCategoryArtworks[visualKey],
      category: visualKey,
    };
  }

  // 4. Default limpio
  return {
    artwork: DEFAULT_ARTWORK,
    category: "default",
  };
}