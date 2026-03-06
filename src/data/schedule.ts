// src/data/schedule.ts
export const STATION_TIMEZONE = "America/Santo_Domingo";

export const SCHEDULE_DEBUG = {
  enabled: __DEV__,
  simulatedISOTime: "2026-02-23T11:59:00",
};

export type ProgramKind = "music" | "show";

export type Program = {
  id: string;
  title: string;
  host?: string;
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
  kind?: ProgramKind;
};

export type WeeklySchedule = {
  [day: number]: Program[];
  // 0 = Domingo
  // 1 = Lunes
  // 2 = Martes
  // 3 = Miércoles
  // 4 = Jueves
  // 5 = Viernes
  // 6 = Sábado
};

const sunday: Program[] = [
  { id: "sun-0500-prayer", title: "Oración al Alba", host: "Equipo miDes", start: "05:00", end: "06:00", kind: "show" },
  { id: "sun-0600-instrumental", title: "Instrumental de Adoración", start: "06:00", end: "07:00", kind: "music" },
  { id: "sun-0700-bible", title: "Lectura Bíblica Guiada", host: "Equipo miDes", start: "07:00", end: "07:30", kind: "show" },
  { id: "sun-0730-devocional", title: "Devocional Dominical", host: "Ps. Ramón De la Cruz", start: "07:30", end: "08:00", kind: "show" },
  { id: "sun-0800-music-adoracion", title: "Música de Adoración", start: "08:00", end: "09:00", kind: "music" },
  { id: "sun-0900-camino-culto", title: "Camino al Culto", host: "Equipo miDes", start: "09:00", end: "10:00", kind: "show" },
  { id: "sun-1000-culto-casa", title: "Culto en Casa", host: "miDes en vivo", start: "10:00", end: "11:30", kind: "show" },
  { id: "sun-1130-music-adoracion", title: "Música de Adoración", start: "11:30", end: "12:00", kind: "music" },
  { id: "sun-1200-familia", title: "Mensaje para la Familia", host: "Ps. Ramón De la Cruz", start: "12:00", end: "13:00", kind: "show" },
  { id: "sun-1300-postrecito", title: "Postrecito de Vida", host: "Ps. Ramón De la Cruz", start: "13:00", end: "13:30", kind: "show" },
  { id: "sun-1330-music", title: "Música", start: "13:30", end: "14:00", kind: "music" },
  { id: "sun-1400-music-adoracion", title: "Música de Adoración", start: "14:00", end: "15:00", kind: "music" },
  { id: "sun-1500-ofrenda", title: "La Ofrenda de la Tarde", host: "Equipo miDes", start: "15:00", end: "16:00", kind: "show" },
  { id: "sun-1600-testimonios", title: "Testimonios de Fe", host: "Equipo miDes", start: "16:00", end: "17:00", kind: "show" },
  { id: "sun-1700-music", title: "Música", start: "17:00", end: "18:00", kind: "music" },
  { id: "sun-1800-reflexion", title: "Reflexión Dominical", host: "Ps. Ramón De la Cruz", start: "18:00", end: "19:00", kind: "show" },
  { id: "sun-1900-music-adoracion", title: "Música de Adoración", start: "19:00", end: "20:00", kind: "music" },
  { id: "sun-2000-esperanza", title: "Noche de Esperanza", host: "Equipo miDes", start: "20:00", end: "21:00", kind: "show" },
  { id: "sun-2100-vigilia", title: "Segunda Vigilia", host: "Equipo miDes", start: "21:00", end: "22:00", kind: "show" },
  { id: "sun-2200-instrumental", title: "Instrumental", start: "22:00", end: "23:00", kind: "music" },
  { id: "sun-2300-mensaje", title: "Hora del Mensaje", host: "Retransmitido", start: "23:00", end: "00:00", kind: "show" },
  { id: "sun-0000-music", title: "Música", start: "00:00", end: "05:00", kind: "music" },
];

const monday: Program[] = [
  { id: "mon-0500-prayer", title: "Oración al Alba", host: "Equipo miDes", start: "05:00", end: "06:00", kind: "show" },
  { id: "mon-0600-instrumental", title: "Música Instrumental", start: "06:00", end: "07:00", kind: "music" },
  { id: "mon-0700-bible", title: "Lectura Biblia Guiada", host: "Equipo miDes", start: "07:00", end: "07:30", kind: "show" },
  { id: "mon-0730-devocional", title: "Devocional", host: "Ps. Ramón De la Cruz", start: "07:30", end: "08:00", kind: "show" },
  { id: "mon-0800-adoracion", title: "Música de Adoración", start: "08:00", end: "09:00", kind: "music" },
  { id: "mon-0900-psicologia-fe", title: "Psicología y Fe", host: "Ps. Ramón De la Cruz", start: "09:00", end: "10:00", kind: "show" },
  { id: "mon-1000-music", title: "Música", start: "10:00", end: "11:00", kind: "music" },
  { id: "mon-1100-music", title: "Música", start: "11:00", end: "12:00", kind: "music" },
  { id: "mon-1200-new-program", title: "New Program", host: "Pending host", start: "12:00", end: "13:00", kind: "show" },
  { id: "mon-1300-postrecito", title: "Postrecito de Vida", host: "Ps. Ramón De la Cruz", start: "13:00", end: "13:30", kind: "show" },
  { id: "mon-1330-music", title: "Música", start: "13:30", end: "14:00", kind: "music" },
  { id: "mon-1400-adoracion", title: "Música de Adoración", start: "14:00", end: "15:00", kind: "music" },
  { id: "mon-1500-ofrenda", title: "La Ofrenda de la Tarde", host: "Equipo miDes", start: "15:00", end: "16:00", kind: "show" },
  { id: "mon-1600-music", title: "Música", start: "16:00", end: "17:00", kind: "music" },
  { id: "mon-1700-music", title: "Música", start: "17:00", end: "18:00", kind: "music" },
  { id: "mon-1800-new-program", title: "New Program", host: "Pending host", start: "18:00", end: "19:00", kind: "show" },
  { id: "mon-1900-music", title: "Música", start: "19:00", end: "20:00", kind: "music" },
  { id: "mon-2000-adoracion", title: "Música de Adoración", start: "20:00", end: "21:00", kind: "music" },
  { id: "mon-2100-vigilia", title: "Segunda Vigilia", host: "Equipo miDes", start: "21:00", end: "22:00", kind: "show" },
  { id: "mon-2200-conexion", title: "Conexión con el Alma", host: "Ps. Ramón De la Cruz", start: "22:00", end: "23:00", kind: "show" },
  { id: "mon-2300-mensaje", title: "La Hora del Mensaje", host: "Retransmitido", start: "23:00", end: "00:00", kind: "show" },
  { id: "mon-0000-music", title: "Música", start: "00:00", end: "05:00", kind: "music" },
];

const tuesday: Program[] = [
  { id: "tue-0500-prayer", title: "Oración al Alba", host: "Equipo miDes", start: "05:00", end: "06:00", kind: "show" },
  { id: "tue-0600-instrumental", title: "Instrumental", start: "06:00", end: "07:00", kind: "music" },
  { id: "tue-0700-bible", title: "Lectura Biblia Guiada", host: "Equipo miDes", start: "07:00", end: "07:30", kind: "show" },
  { id: "tue-0730-devocional", title: "Devocional", host: "Ps. Ramón De la Cruz", start: "07:30", end: "08:00", kind: "show" },
  { id: "tue-0800-adoracion", title: "Música de Adoración", start: "08:00", end: "09:00", kind: "music" },
  { id: "tue-0900-hablemos-oracion", title: "Hablemos de Oración", host: "Ps. Katherin Taveras", start: "09:00", end: "10:00", kind: "show" },
  { id: "tue-1000-music", title: "Música", start: "10:00", end: "11:00", kind: "music" },
  { id: "tue-1100-music", title: "Música", start: "11:00", end: "12:00", kind: "music" },
  { id: "tue-1200-hola-mujer", title: "¡Hola Mujer!", host: "Ps. Yomaira Jiménez", start: "12:00", end: "13:00", kind: "show" },
  { id: "tue-1300-postrecito", title: "Postrecito de Vida", host: "Ps. Ramón De la Cruz", start: "13:00", end: "13:30", kind: "show" },
  { id: "tue-1330-music", title: "Música", start: "13:30", end: "14:00", kind: "music" },
  { id: "tue-1400-adoracion", title: "Música de Adoración", start: "14:00", end: "15:00", kind: "music" },
  { id: "tue-1500-ofrenda", title: "La Ofrenda de la Tarde", host: "Equipo miDes", start: "15:00", end: "16:00", kind: "show" },
  { id: "tue-1600-music", title: "Música", start: "16:00", end: "17:00", kind: "music" },
  { id: "tue-1700-music", title: "Música", start: "17:00", end: "18:00", kind: "music" },
  { id: "tue-1800-arranca-fa", title: "Arranca en Fa", host: "Manuel Pelaez", start: "18:00", end: "19:00", kind: "show" },
  { id: "tue-1900-music", title: "Música", start: "19:00", end: "20:00", kind: "music" },
  { id: "tue-2000-adoracion", title: "Música de Adoración", start: "20:00", end: "21:00", kind: "music" },
  { id: "tue-2100-vigilia", title: "Segunda Vigilia", host: "Equipo miDes", start: "21:00", end: "22:00", kind: "show" },
  { id: "tue-2200-instrumental-night", title: "Música Instrumental", start: "22:00", end: "23:00", kind: "music" },
  { id: "tue-2300-mensaje", title: "La Hora del Mensaje", host: "Retransmitido", start: "23:00", end: "00:00", kind: "show" },
  { id: "tue-0000-music", title: "Música", start: "00:00", end: "05:00", kind: "music" },
];

const wednesday: Program[] = [
  { id: "wed-0500-prayer", title: "Oración al Alba", host: "Equipo miDes", start: "05:00", end: "06:00", kind: "show" },
  { id: "wed-0600-instrumental", title: "Instrumental", start: "06:00", end: "07:00", kind: "music" },
  { id: "wed-0700-bible", title: "Lectura Biblia Guiada", host: "Equipo miDes", start: "07:00", end: "07:30", kind: "show" },
  { id: "wed-0730-devocional", title: "Devocional", host: "Ps. Ramón De la Cruz", start: "07:30", end: "08:00", kind: "show" },
  { id: "wed-0800-adoracion", title: "Música de Adoración", start: "08:00", end: "09:00", kind: "music" },
  { id: "wed-0900-new-program", title: "New Program", host: "Pending host", start: "09:00", end: "10:00", kind: "show" },
  { id: "wed-1000-music", title: "Música", start: "10:00", end: "11:00", kind: "music" },
  { id: "wed-1100-music", title: "Música", start: "11:00", end: "12:00", kind: "music" },
  { id: "wed-1200-salud", title: "Programa de Salud", host: "Pending host", start: "12:00", end: "13:00", kind: "show" },
  { id: "wed-1300-postrecito", title: "Postrecito de Vida", host: "Ps. Ramón De la Cruz", start: "13:00", end: "13:30", kind: "show" },
  { id: "wed-1330-music", title: "Música", start: "13:30", end: "14:00", kind: "music" },
  { id: "wed-1400-adoracion", title: "Música de Adoración", start: "14:00", end: "15:00", kind: "music" },
  { id: "wed-1500-ofrenda", title: "La Ofrenda de la Tarde", host: "Equipo miDes", start: "15:00", end: "16:00", kind: "show" },
  { id: "wed-1600-music", title: "Música", start: "16:00", end: "17:00", kind: "music" },
  { id: "wed-1700-music", title: "Música", start: "17:00", end: "18:00", kind: "music" },
  { id: "wed-1800-new-program", title: "New Program", host: "Pending host", start: "18:00", end: "19:00", kind: "show" },
  { id: "wed-1900-music", title: "Música", start: "19:00", end: "20:00", kind: "music" },
  { id: "wed-2000-adoracion", title: "Música de Adoración", start: "20:00", end: "21:00", kind: "music" },
  { id: "wed-2100-vigilia", title: "Segunda Vigilia", host: "Equipo miDes", start: "21:00", end: "22:00", kind: "show" },
  { id: "wed-2200-conexion", title: "Conexión con el Alma", host: "Ps. Ramón De la Cruz", start: "22:00", end: "23:00", kind: "show" },
  { id: "wed-2300-mensaje", title: "Hora del Mensaje", host: "Retransmitido", start: "23:00", end: "00:00", kind: "show" },
  { id: "wed-0000-music", title: "Música", start: "00:00", end: "05:00", kind: "music" },
];

const thursday: Program[] = [
  { id: "thu-0500-prayer", title: "Oración al Alba", host: "Equipo miDes", start: "05:00", end: "06:00", kind: "show" },
  { id: "thu-0600-instrumental", title: "Instrumental", start: "06:00", end: "07:00", kind: "music" },
  { id: "thu-0700-bible", title: "Lectura Biblia Guiada", host: "Equipo miDes", start: "07:00", end: "07:30", kind: "show" },
  { id: "thu-0730-devocional", title: "Devocional", host: "Ps. Ramón De la Cruz", start: "07:30", end: "08:00", kind: "show" },
  { id: "thu-0800-adoracion", title: "Música de Adoración", start: "08:00", end: "09:00", kind: "music" },
  { id: "thu-0900-alzar-voz", title: "Tiempo de Alzar la Voz", host: "Ps. Ramón De la Cruz", start: "09:00", end: "10:00", kind: "show" },
  { id: "thu-1000-music", title: "Música", start: "10:00", end: "11:00", kind: "music" },
  { id: "thu-1100-music", title: "Música", start: "11:00", end: "12:00", kind: "music" },
  { id: "thu-1200-hola-mujer", title: "¡Hola Mujer!", host: "Ps. Yomaira Jiménez", start: "12:00", end: "13:00", kind: "show" },
  { id: "thu-1300-postrecito", title: "Postrecito de Vida", host: "Ps. Ramón De la Cruz", start: "13:00", end: "13:30", kind: "show" },
  { id: "thu-1330-music", title: "Música", start: "13:30", end: "14:00", kind: "music" },
  { id: "thu-1400-adoracion", title: "Música de Adoración", start: "14:00", end: "15:00", kind: "music" },
  { id: "thu-1500-ofrenda", title: "La Ofrenda de la Tarde", host: "Equipo miDes", start: "15:00", end: "16:00", kind: "show" },
  { id: "thu-1600-music", title: "Música", start: "16:00", end: "17:00", kind: "music" },
  { id: "thu-1700-music", title: "Música", start: "17:00", end: "18:00", kind: "music" },
  { id: "thu-1800-new-program", title: "New Program", host: "Pending host", start: "18:00", end: "19:00", kind: "show" },
  { id: "thu-1900-music", title: "Música", start: "19:00", end: "20:00", kind: "music" },
  { id: "thu-2000-discipulado", title: "Discipulado en Casa", host: "Iglesia miDes en vivo", start: "20:00", end: "21:00", kind: "show" },
  { id: "thu-2100-vigilia", title: "Segunda Vigilia", host: "Equipo miDes", start: "21:00", end: "22:00", kind: "show" },
  { id: "thu-2200-instrumental-night", title: "Música Instrumental", start: "22:00", end: "23:00", kind: "music" },
  { id: "thu-2300-mensaje", title: "Hora del Mensaje", host: "Retransmitido", start: "23:00", end: "00:00", kind: "show" },
  { id: "thu-0000-music", title: "Música", start: "00:00", end: "05:00", kind: "music" },
];

const friday: Program[] = [
  { id: "fri-0500-prayer", title: "Oración al Alba", host: "Equipo miDes", start: "05:00", end: "06:00", kind: "show" },
  { id: "fri-0600-instrumental", title: "Instrumental", start: "06:00", end: "07:00", kind: "music" },
  { id: "fri-0700-bible", title: "Lectura Biblia Guiada", host: "Equipo miDes", start: "07:00", end: "07:30", kind: "show" },
  { id: "fri-0730-devocional", title: "Devocional", host: "Ps. Ramón De la Cruz", start: "07:30", end: "08:00", kind: "show" },
  { id: "fri-0800-adoracion", title: "Música de Adoración", start: "08:00", end: "09:00", kind: "music" },
  { id: "fri-0900-new-program", title: "New Program", host: "Pending host", start: "09:00", end: "10:00", kind: "show" },
  { id: "fri-1000-music", title: "Música", start: "10:00", end: "11:00", kind: "music" },
  { id: "fri-1100-music", title: "Música", start: "11:00", end: "12:00", kind: "music" },
  { id: "fri-1200-new-program", title: "New Program", host: "Pending host", start: "12:00", end: "13:00", kind: "show" },
  { id: "fri-1300-postrecito", title: "Postrecito de Vida", host: "Ps. Ramón De la Cruz", start: "13:00", end: "13:30", kind: "show" },
  { id: "fri-1330-music", title: "Música", start: "13:30", end: "14:00", kind: "music" },
  { id: "fri-1400-adoracion", title: "Música de Adoración", start: "14:00", end: "15:00", kind: "music" },
  { id: "fri-1500-ofrenda", title: "La Ofrenda de la Tarde", host: "Equipo miDes", start: "15:00", end: "16:00", kind: "show" },
  { id: "fri-1600-music", title: "Música", start: "16:00", end: "17:00", kind: "music" },
  { id: "fri-1700-music", title: "Música", start: "17:00", end: "18:00", kind: "music" },
  { id: "fri-1800-new-program", title: "New Program", host: "Pending host", start: "18:00", end: "19:00", kind: "show" },
  { id: "fri-1900-music", title: "Música", start: "19:00", end: "20:00", kind: "music" },
  { id: "fri-2000-music", title: "Música", start: "20:00", end: "21:00", kind: "music" },
  { id: "fri-2100-vigilia", title: "Segunda Vigilia", host: "Equipo miDes", start: "21:00", end: "22:00", kind: "show" },
  { id: "fri-2200-conexion", title: "Conexión con el Alma", host: "Ps. Ramón De la Cruz", start: "22:00", end: "23:00", kind: "show" },
  { id: "fri-2300-mensaje", title: "Hora del Mensaje", host: "Retransmitido", start: "23:00", end: "00:00", kind: "show" },
  { id: "fri-0000-music", title: "Música", start: "00:00", end: "05:00", kind: "music" },
];

const saturday: Program[] = [
  { id: "sat-0500-prayer", title: "Oración al Alba", host: "Equipo miDes", start: "05:00", end: "06:00", kind: "show" },
  { id: "sat-0600-instrumental", title: "Instrumental", start: "06:00", end: "07:00", kind: "music" },
  { id: "sat-0700-bible", title: "Lectura Biblia Guiada", host: "Equipo miDes", start: "07:00", end: "07:30", kind: "show" },
  { id: "sat-0730-devocional", title: "Devocional", host: "Ps. Ramón De la Cruz", start: "07:30", end: "08:00", kind: "show" },
  { id: "sat-0800-adoracion", title: "Música de Adoración", start: "08:00", end: "09:00", kind: "music" },
  { id: "sat-0900-new-program", title: "New Program", host: "Pending host", start: "09:00", end: "10:00", kind: "show" },
  { id: "sat-1000-new-program", title: "New Program", host: "Pending host", start: "10:00", end: "11:00", kind: "show" },
  { id: "sat-1100-jovenes", title: "Los Jóvenes Preguntan", host: "Equipo miDes", start: "11:00", end: "12:00", kind: "show" },
  { id: "sat-1200-news", title: "Cristianos por el Mundo News", host: "Ps. Ramón De la Cruz", start: "12:00", end: "13:00", kind: "show" },
  { id: "sat-1300-postrecito", title: "Postrecito de Vida", host: "Ps. Ramón De la Cruz", start: "13:00", end: "13:30", kind: "show" },
  { id: "sat-1330-music", title: "Música", start: "13:30", end: "14:00", kind: "music" },
  { id: "sat-1400-adoracion", title: "Música de Adoración", start: "14:00", end: "15:00", kind: "music" },
  { id: "sat-1500-ofrenda", title: "La Ofrenda de la Tarde", host: "Equipo miDes", start: "15:00", end: "16:00", kind: "show" },
  { id: "sat-1600-music", title: "Música", start: "16:00", end: "17:00", kind: "music" },
  { id: "sat-1700-music", title: "Música", start: "17:00", end: "18:00", kind: "music" },
  { id: "sat-1800-new-program", title: "New Program", host: "Pending host", start: "18:00", end: "19:00", kind: "show" },
  { id: "sat-1900-music", title: "Música", start: "19:00", end: "20:00", kind: "music" },
  { id: "sat-2000-music", title: "Música", start: "20:00", end: "21:00", kind: "music" },
  { id: "sat-2100-vigilia", title: "Segunda Vigilia", host: "Equipo miDes", start: "21:00", end: "22:00", kind: "show" },
  { id: "sat-2200-music", title: "Música", start: "22:00", end: "23:00", kind: "music" },
  { id: "sat-2300-mensaje", title: "Hora del Mensaje", host: "Retransmitido", start: "23:00", end: "00:00", kind: "show" },
  { id: "sat-0000-music", title: "Música", start: "00:00", end: "05:00", kind: "music" },
];

export const weeklySchedule: WeeklySchedule = {
  0: sunday,
  1: monday,
  2: tuesday,
  3: wednesday,
  4: thursday,
  5: friday,
  6: saturday,
};