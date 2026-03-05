import { weeklySchedule } from "../data/schedule";

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function getCurrentProgram() {
  const now = new Date();

  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();

  const today = weeklySchedule[day] ?? [];

  for (const program of today) {
    const start = timeToMinutes(program.start);
    const end = timeToMinutes(program.end);

    if (minutes >= start && minutes < end) {
      return program;
    }
  }

  return null;
}