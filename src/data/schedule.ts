export const STATION_TIMEZONE = "America/Santo_Domingo";
export const SCHEDULE_DEBUG = {
  enabled: __DEV__, // solo activo en desarrollo
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

export const weeklySchedule: WeeklySchedule = {
  0: [
    {
      id: "sun-morning",
      title: "Alabanza Dominical",
      host: "Ramon",
      start: "08:00",
      end: "10:00",
    },
    {
      id: "sun-night",
      title: "Música Nocturna",
      start: "22:00",
      end: "02:00", // cruza medianoche
    },
  ],

  1: [
    {
      id: "mon-prayer",
      title: "Orando al Alba",
      start: "05:00",
      end: "06:00",
    },
    {
      id: "mon-music",
      title: "Música - Adorando al Rey",
      start: "06:00",
      end: "07:00",
    },
    {
      id: "mon-music",
      title: "Devocioanal - Buenos días",
      start: "07:00",
      end: "08:00",
    },
    {
      id: "mon-music",
      title: "Música Inspiradora",
      start: "08:00",
      end: "12:00",
    },
    {
      id: "mon-prayer",
      title: "Tiempo de Oración",
      start: "12:00",
      end: "13:00",
    },
    {
      id: "mon-evening",
      title: "Reflexión de la Tarde",
      start: "18:00",
      end: "19:00",
    },
    {
      id: "mon-night",
      title: "Música Nocturna",
      start: "22:00",
      end: "02:00", // cruza medianoche
    },
  ],

  // Replica estructura para los demás días
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
};