// src/data/dailyPhrases.ts

export type PhraseCategory =
  | "Gratitud"
  | "Fe"
  | "Paz"
  | "Esperanza"
  | "Fortaleza"
  | "Dirección"
  | "Ánimo"
  | "Amor"
  | "Confianza";

export type DailyPhrase = {
  text: string;
  category: PhraseCategory;
};

export const DAILY_PHRASES: DailyPhrase[] = [
  { category: "Gratitud", text: "Dios ha sido fiel. Si miras atrás, encontrarás evidencia." },
  { category: "Paz", text: "Respira. La paz de Cristo gobierna tu corazón hoy." },
  { category: "Fe", text: "Hoy caminas por fe, no por vista. Dios va delante de ti." },
  { category: "Esperanza", text: "Aunque parezca lento, Dios está obrando. No sueltes la esperanza." },
  { category: "Fortaleza", text: "No estás solo. El Señor es tu fuerza cuando te faltan fuerzas." },
  { category: "Dirección", text: "Un paso a la vez. Dios ilumina el camino mientras avanzas." },
  { category: "Ánimo", text: "Levanta la mirada. Tu historia no termina aquí." },
  { category: "Amor", text: "Eres amado más de lo que imaginas. Descansa en Su amor." },
  { category: "Confianza", text: "Suelta el control. Confía: Dios sostiene lo que tú no puedes." },

  { category: "Paz", text: "Cuando el ruido suba, escucha al Señor más fuerte que tu miedo." },
  { category: "Fe", text: "Dios no llega tarde. Su tiempo es perfecto para tu vida." },
  { category: "Esperanza", text: "La gracia de hoy es suficiente para la carga de hoy." },
  { category: "Fortaleza", text: "Si hoy es difícil, recuerda: Dios es constante." },
  { category: "Dirección", text: "Ora primero. La claridad viene con la presencia." },
  { category: "Ánimo", text: "No te rindas. Dios está formando carácter, no solo resultados." },
  { category: "Amor", text: "El amor de Cristo no es teoría: te sostiene en lo real." },
  { category: "Gratitud", text: "Agradece lo pequeño: Dios usa lo simple para hacer milagros." },
  { category: "Confianza", text: "La ansiedad no es tu hogar. Vuelve a la confianza en Dios." },

  { category: "Fe", text: "Tu fe puede ser pequeña, pero tu Dios es grande." },
  { category: "Paz", text: "Jesús está en tu barca. La tormenta no tiene la última palabra." },
  { category: "Esperanza", text: "Dios abre puertas que nadie puede cerrar." },
  { category: "Fortaleza", text: "Dios te sostiene incluso cuando tú no te sostienes." },
  { category: "Dirección", text: "No corras. Escucha. Obedece. Avanza." },
  { category: "Ánimo", text: "Lo que hoy duele, mañana puede ser testimonio." },
  { category: "Amor", text: "Dios no te tolera: te abraza. Eres hijo, no invitado." },
  { category: "Gratitud", text: "La gratitud cambia el enfoque: del problema al Proveedor." },
  { category: "Confianza", text: "Dios no te abandona en el proceso: Él lo completa." },

  { category: "Paz", text: "Tu alma puede descansar: Dios está presente aquí y ahora." },
  { category: "Fe", text: "Si Dios lo prometió, Él lo cumple." },
  { category: "Esperanza", text: "Dios convierte desiertos en caminos." },
];