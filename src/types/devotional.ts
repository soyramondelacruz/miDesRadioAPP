export type DevotionalCategory =
  | "salvacion"
  | "gracia"
  | "fe"
  | "identidad"
  | "discipulado"
  | "espiritu"
  | "santidad"
  | "esperanza";

export interface DevotionalEntry {
  id: number;
  reference: string;
  text: string;
  category: DevotionalCategory;
  reflection: string;
}