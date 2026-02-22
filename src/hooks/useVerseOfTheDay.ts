import { useMemo } from "react";
import { VERSES } from "../data/verses365";
import { REFLECTIONS_BY_CATEGORY } from "../data/reflectionsByCategory";

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);

  const diff =
    date.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;

  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function useVerseOfTheDay() {
  const today = new Date();
  const dayIndex = getDayOfYear(today);

  const verse = useMemo(() => {
    const index = (dayIndex - 1) % VERSES.length;
    return VERSES[index];
  }, [dayIndex]);

  const reflection = useMemo(() => {
    if (!verse) return "";

    const reflections = REFLECTIONS_BY_CATEGORY[verse.category];
    const index = verse.id % reflections.length;

    return reflections[index];
  }, [verse]);

  return {
    verse,
    reflection,
    loading: false,
  };
}