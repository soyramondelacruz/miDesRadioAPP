import { VerseCategory } from "./reflectionsByCategory";

export interface Verse {
  id: number;
  text: string;
  reference: string;
  category: VerseCategory;
}

const BASE_VERSES: Omit<Verse, "id">[] = [
  {
    text: "Porque de tal manera amó Dios al mundo...",
    reference: "Juan 3:16",
    category: "salvacion",
  },
  {
    text: "El Señor es mi pastor; nada me faltará.",
    reference: "Salmo 23:1",
    category: "esperanza",
  },
  {
    text: "Todo lo puedo en Cristo que me fortalece.",
    reference: "Filipenses 4:13",
    category: "fortaleza",
  },
  {
    text: "Yo soy el camino, y la verdad, y la vida.",
    reference: "Juan 14:6",
    category: "jesus",
  },
  {
    text: "Mas el Consolador, el Espíritu Santo...",
    reference: "Juan 14:26",
    category: "espiritu",
  },
  {
    text: "Por gracia sois salvos por medio de la fe.",
    reference: "Efesios 2:8",
    category: "gracia",
  },
  {
    text: "El justo por la fe vivirá.",
    reference: "Romanos 1:17",
    category: "fe",
  },
  {
    text: "El amor es sufrido, es benigno...",
    reference: "1 Corintios 13:4",
    category: "amor",
  },
];

/**
 * Genera 365 días automáticamente.
 * Cambia por fecha local del usuario.
 * No usa API.
 */
export const VERSES: Verse[] = Array.from({ length: 365 }, (_, i) => {
  const base = BASE_VERSES[i % BASE_VERSES.length];

  return {
    id: i + 1,
    ...base,
  };
});