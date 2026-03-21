// src/data/programCatalog.ts
import { ProgramKind } from "./schedule";

export type ProgramCatalogItem = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  visualKey?: string;
  featured?: boolean;
  kind?: ProgramKind;
  episodes?: {
    enabled: boolean;
  };
};

export const programCatalogById: Record<string, ProgramCatalogItem> = {
  // AGRUPADOS / EDITORIALES
  "tiempos-oracion": {
    id: "tiempos-oracion",
    title: "Tiempos de Oración",
    subtitle: "Oración al Alba • Ofrenda de la Tarde • Segunda Vigilia",
    description:
      "Espacios diarios dedicados a la oración en distintos momentos del día para buscar a Dios, interceder y fortalecer la vida espiritual.",
    visualKey: "prayer",
    featured: true,
    kind: "show",
    episodes: { enabled: false },
  },

  "lectura-biblica-guiada": {
    id: "lectura-biblica-guiada",
    title: "Lectura Bíblica Guiada",
    subtitle: "Equipo miDes",
    description:
      "Lectura guiada de las Escrituras para cultivar el hábito de la Palabra y meditar en ella con claridad y reverencia.",
    visualKey: "teaching",
    featured: false,
    kind: "show",
    episodes: { enabled: false },
  },

  devocional: {
    id: "devocional",
    title: "Devocional",
    subtitle: "Ps. Ramón De la Cruz",
    description:
      "Reflexiones breves y edificantes para comenzar el día con enfoque espiritual, fe y esperanza en Cristo.",
    visualKey: "message",
    featured: false,
    kind: "show",
    episodes: { enabled: true },
  },

  "hora-del-mensaje": {
    id: "hora-del-mensaje",
    title: "Hora del Mensaje",
    subtitle: "Retransmitido",
    description:
      "Espacio de predicación y exhortación bíblica para edificar, confrontar y fortalecer la fe de la audiencia.",
    visualKey: "message",
    featured: false,
    kind: "show",
    episodes: { enabled: false },

  },

    "musica-instrumental": {
    id: "musica-instrumental",
    title: "Música Instrumental",
    subtitle: "Paz que produce calma",
    description:
      "Espacio para reflexionar y meditar en la presencia de Dios.",
    visualKey: "music",
    featured: false,
    kind: "music",
    episodes: { enabled: false },
  },

  "musica-adoracion": {
    id: "musica-adoracion",
    title: "Música para adorar",
    subtitle: "Salmos de alabanza",
    description:
      "Espacio para rendir adoración a Dios por sus muchas bondades.",
    visualKey: "music",
    featured: false,
    kind: "music",
    episodes: { enabled: false },
  },

  // SHOWS CON IDENTIDAD PROPIA
  "mon-0900-psicologia-fe": {
    id: "mon-0900-psicologia-fe",
    title: "Psicología y Fe",
    subtitle: "Ps. Ramón De la Cruz",
    description:
      "Espacio para conversar sobre salud emocional, fe, restauración y esperanza desde una perspectiva cristiana.",
    visualKey: "psychology",
    featured: true,
    kind: "show",
    episodes: { enabled: true },
  },

  "mon-1300-postrecito": {
    id: "mon-1300-postrecito",
    title: "Postrecito de Vida",
    subtitle: "Ps. Ramón De la Cruz",
    description:
      "Reflexiones breves, prácticas y edificantes para nutrir el alma en medio del día.",
    visualKey: "postrecito",
    featured: true,
    kind: "show",
    episodes: { enabled: true },
  },

  "mon-2200-conexion": {
    id: "mon-2200-conexion",
    title: "Conexión con el Alma",
    subtitle: "Ps. Ramón De la Cruz",
    description:
      "Programa nocturno de acompañamiento espiritual, reflexión y restauración interior.",
    visualKey: "message",
    featured: true,
    kind: "show",
    episodes: { enabled: true },
  },

  "tue-0900-hablemos-oracion": {
    id: "tue-0900-hablemos-oracion",
    title: "Hablemos de Oración",
    subtitle: "Ps. Katherin Taveras",
    description:
      "Conversaciones que fortalecen la vida de oración y la intimidad con Dios.",
    visualKey: "prayer",
    featured: true,
    kind: "show",
    episodes: { enabled: true },
  },

  "tue-1200-hola-mujer": {
    id: "tue-1200-hola-mujer",
    title: "¡Hola Mujer!",
    subtitle: "Ps. Yomaira Jiménez",
    description:
      "Programa pensado para la mujer cristiana, su crecimiento, familia y propósito.",
    visualKey: "message",
    featured: true,
    kind: "show",
    episodes: { enabled: true },
  },

  "tue-1800-arranca-fa": {
    id: "tue-1800-arranca-fa",
    title: "Arranca en Fa",
    subtitle: "Manuel Pelaez",
    description:
      "Espacio dinámico con enfoque musical, conversación y energía positiva.",
    visualKey: "music",
    featured: true,
    kind: "show",
    episodes: { enabled: true },
  },

  "wed-1200-salud": {
    id: "wed-1200-salud",
    title: "Programa de Salud",
    subtitle: "Pending host",
    description:
      "Contenido orientado al bienestar físico, emocional y preventivo desde una perspectiva integral.",
    visualKey: "psychology",
    featured: true,
    kind: "show",
    episodes: { enabled: true },
  },

  "thu-0900-alzar-voz": {
    id: "thu-0900-alzar-voz",
    title: "Tiempo de Alzar la Voz",
    subtitle: "Ps. Ramón De la Cruz",
    description:
      "Programa de palabra, exhortación y reflexión con enfoque ministerial y comunitario.",
    visualKey: "teaching",
    featured: true,
    kind: "show",
    episodes: { enabled: true },
  },

  "thu-2000-discipulado": {
    id: "thu-2000-discipulado",
    title: "Discipulado en Casa",
    subtitle: "Iglesia miDes en vivo",
    description:
      "Espacio de formación cristiana y crecimiento espiritual para la iglesia y la familia.",
    visualKey: "teaching",
    featured: true,
    kind: "show",
    episodes: { enabled: true },
  },

  "sat-1100-jovenes": {
    id: "sat-1100-jovenes",
    title: "Los Jóvenes Preguntan",
    subtitle: "Equipo miDes",
    description:
      "Programa juvenil con preguntas reales, respuestas bíblicas y conversación relevante.",
    visualKey: "teaching",
    featured: true,
    kind: "show",
    episodes: { enabled: true },
  },

  "sat-1200-news": {
    id: "sat-1200-news",
    title: "Cristianos por el Mundo News",
    subtitle: "Ps. Ramón De la Cruz",
    description:
      "Noticias, actualidad e información de interés desde una mirada cristiana.",
    visualKey: "news",
    featured: true,
    kind: "show",
    episodes: { enabled: true },
  },

  "sun-1000-culto-casa": {
    id: "sun-1000-culto-casa",
    title: "Culto en Casa",
    subtitle: "miDes en vivo",
    description:
      "Predicación, adoración y comunión para vivir el domingo desde casa y en familia.",
    visualKey: "teaching",
    featured: true,
    kind: "show",
    episodes: { enabled: true },
  },

  "sun-1200-familia": {
    id: "sun-1200-familia",
    title: "Mensaje para la Familia",
    subtitle: "Ps. Ramón De la Cruz",
    description:
      "Palabra y reflexión para fortalecer el hogar, la fe y la vida familiar.",
    visualKey: "message",
    featured: true,
    kind: "show",
    episodes: { enabled: true },
  },

  "sun-1600-testimonios": {
    id: "sun-1600-testimonios",
    title: "Testimonios de Fe",
    subtitle: "Equipo miDes",
    description:
      "Historias reales de transformación, restauración y esperanza en Cristo.",
    visualKey: "message",
    featured: true,
    kind: "show",
    episodes: { enabled: true },
  },
};