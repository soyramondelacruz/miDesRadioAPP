import { VERSES } from "../data/verses365";

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff =
    date.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;

  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getVerseForToday() {
  const today = new Date();
  const dayIndex = getDayOfYear(today);

  const index = (dayIndex - 1) % VERSES.length;

  return VERSES[index];
}