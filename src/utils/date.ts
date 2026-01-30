import type { Weekday } from "../types/content.types";

const WEEKDAYS: Weekday[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getTodayWeekday(timeZone: string): Weekday {
  // "en-US" devuelve Sunday/Monday/... que coincide con nuestro tipo
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone,
  });
  const day = formatter.format(new Date());

  // Fallback por seguridad
  if (WEEKDAYS.includes(day as Weekday)) return day as Weekday;
  return "Monday";
}

export function rotateWeek<T extends { day: Weekday }>(
  week: T[],
  startDay: Weekday
): T[] {
  const idx = week.findIndex((d) => d.day === startDay);
  if (idx <= 0) return week;

  return [...week.slice(idx), ...week.slice(0, idx)];
}