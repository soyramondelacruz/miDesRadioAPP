// src/data/schedule.ts
export const STATION_TIMEZONE = "America/Santo_Domingo";

/**
 * DEBUG:
 * - En dev, NO queremos simular tiempo siempre.
 * - Actívalo solo cuando lo necesites cambiando enabled a true.
 */
export const SCHEDULE_DEBUG = {
  enabled: false,
  simulatedISOTime: "2026-02-23T11:59:00",
};

export type Program = {
  id: string;
  title: string;
  host?: string;
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
};

export type WeeklySchedule = {
  [day: number]: Program[];
  // 0 = Domingo
  // 1 = Lunes
  // ...
  // 6 = Sábado
};

const monFri: Program[] = [
  { id: "wk-0500-prayer", title: "Oración al Alba", host: "Ps. Ramón", start: "05:00", end: "06:00" },
  { id: "wk-0600-instrumental", title: "Instrumental", start: "06:00", end: "07:00" },
  { id: "wk-0700-bible", title: "Lectura Bíblica Guiada", host: "Equipo miDes", start: "07:00", end: "07:30" },
  { id: "wk-0730-devocional", title: "Devocional", host: "Ps. Ramón", start: "07:30", end: "08:00" },
  { id: "wk-0800-music", title: "Música", start: "08:00", end: "09:00" },
  { id: "wk-0900-psicologia-fe", title: "Psicología y Fe", host: "Ps. Ramón", start: "09:00", end: "10:00" },
  { id: "wk-1000-music", title: "Música", start: "10:00", end: "12:00" },
  { id: "wk-1200-mensaje", title: "Hora del Mensaje", host: "Retransmitido", start: "12:00", end: "13:00" },
  { id: "wk-1300-postrecito", title: "Postrecito de Vida", host: "Ps. Ramón", start: "13:00", end: "13:30" },
  { id: "wk-1330-music", title: "Música", start: "13:30", end: "14:00" },
  { id: "wk-1400-music", title: "Música", start: "14:00", end: "15:00" },
  { id: "wk-1500-ofrenda-tarde", title: "La Ofrenda de la Tarde", host: "Equipo miDes", start: "15:00", end: "16:00" },
  { id: "wk-1600-music", title: "Música", start: "16:00", end: "17:00" },
  { id: "wk-1700-music", title: "Música", start: "17:00", end: "18:00" },
  { id: "wk-1800-estudio", title: "Estudio Bíblico", host: "Equipo miDes", start: "18:00", end: "19:00" },
  { id: "wk-1900-music", title: "Música", start: "19:00", end: "21:00" },
  { id: "wk-2100-vigilia", title: "Segunda Vigilia", host: "Equipo miDes", start: "21:00", end: "22:00" },
  { id: "wk-2200-instrumental", title: "Instrumental", start: "22:00", end: "23:00" },
  { id: "wk-2300-mensaje", title: "Mensaje", host: "Retransmitido", start: "23:00", end: "00:00" },
  { id: "wk-0000-music", title: "Música", start: "00:00", end: "05:00" },
];

export const weeklySchedule: WeeklySchedule = {
  0: [], // Domingo (pendiente)
  1: monFri,
  2: monFri,
  3: monFri,
  4: monFri,
  5: monFri,
  6: [], // Sábado (pendiente)
};