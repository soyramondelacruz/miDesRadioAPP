import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { colors, spacing } from "../theme";
import {
  weeklySchedule,
  Program,
  STATION_TIMEZONE,
  SCHEDULE_DEBUG,
} from "../data/schedule";

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getStationNow() {
  const baseDate =
    SCHEDULE_DEBUG.enabled && SCHEDULE_DEBUG.simulatedISOTime
      ? new Date(SCHEDULE_DEBUG.simulatedISOTime)
      : new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: STATION_TIMEZONE,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  });

  const parts = formatter.formatToParts(baseDate);

  const hour = Number(parts.find(p => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find(p => p.type === "minute")?.value ?? 0);
  const weekdayStr = parts.find(p => p.type === "weekday")?.value ?? "Mon";

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    day: weekdayMap[weekdayStr],
    minutes: hour * 60 + minute,
  };
}

function isNowInProgram(
  currentMinutes: number,
  start: number,
  end: number
) {
  if (end > start) {
    return currentMinutes >= start && currentMinutes < end;
  }

  // Cruza medianoche
  return currentMinutes >= start || currentMinutes < end;
}

function getProgramProgress(
  currentMinutes: number,
  start: number,
  end: number
) {
  let duration;
  let elapsed;

  if (end > start) {
    duration = end - start;
    elapsed = currentMinutes - start;
  } else {
    duration = 1440 - start + end;
    elapsed =
      currentMinutes >= start
        ? currentMinutes - start
        : 1440 - start + currentMinutes;
  }

  const percent = (elapsed / duration) * 100;
  return Math.max(0, Math.min(100, percent));
}

function getRemainingMinutes(
  currentMinutes: number,
  start: number,
  end: number
) {
  if (end > start) {
    return end - currentMinutes;
  }

  if (currentMinutes >= start) {
    return 1440 - currentMinutes + end;
  }

  return end - currentMinutes;
}

function getCurrentAndNextProgram(): {
  current: Program | null;
  next: Program | null;
} {
  const { day, minutes } = getStationNow();
  const todaySchedule = weeklySchedule[day] || [];

  let current: Program | null = null;
  let next: Program | null = null;

  for (let i = 0; i < todaySchedule.length; i++) {
    const program = todaySchedule[i];
    const start = timeToMinutes(program.start);
    const end = timeToMinutes(program.end);

    if (isNowInProgram(minutes, start, end)) {
      current = program;
      next = todaySchedule[i + 1] ?? null;
      break;
    }
  }

  if (!current) {
    for (let i = 0; i < todaySchedule.length; i++) {
      const start = timeToMinutes(todaySchedule[i].start);
      if (minutes < start) {
        next = todaySchedule[i];
        break;
      }
    }
  }

  return { current, next };
}

export function ScheduleSection() {
  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
  const [nextProgram, setNextProgram] = useState<Program | null>(null);

  useEffect(() => {
    function update() {
      const { current, next } = getCurrentAndNextProgram();
      setCurrentProgram(current);
      setNextProgram(next);
    }

    update();
    const interval = setInterval(update, 60000);

    return () => clearInterval(interval);
  }, []);

  const { minutes } = getStationNow();

  let progress = 0;
  let remaining = 0;

  if (currentProgram) {
    const start = timeToMinutes(currentProgram.start);
    const end = timeToMinutes(currentProgram.end);

    progress = getProgramProgress(minutes, start, end);
    remaining = getRemainingMinutes(minutes, start, end);
  }

  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 16,
        padding: spacing.lg,
        gap: spacing.md,
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 12,
            color: colors.primary,
            fontWeight: "600",
            letterSpacing: 1,
          }}
        >
          EN ESTE MOMENTO
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#38455c",
            marginTop: 4,
          }}
        >
          {currentProgram?.title ?? "Música Continua"}
        </Text>

        {currentProgram && (
          <>
            <Text style={{ color: "#184f92", marginTop: 2 }}>
              {currentProgram.start} – {currentProgram.end}
            </Text>

            {/* Barra de progreso */}
            <View
              style={{
                marginTop: 10,
                height: 6,
                backgroundColor: "#e0e0e0",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: colors.primary,
                }}
              />
            </View>

            {/* Tiempo restante */}
            {remaining > 0 && (
              <Text
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginTop: 6,
                }}
              >
                {remaining === 1
                  ? "Finaliza en 1 minuto"
                  : `Faltan ${remaining} minutos`}
              </Text>
            )}
          </>
        )}
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: "#eaeaea",
        }}
      />

      <View>
        <Text
          style={{
            fontSize: 12,
            color: colors.accent,
            fontWeight: "600",
            letterSpacing: 1,
          }}
        >
          PRÓXIMO
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#38455c",
            marginTop: 4,
          }}
        >
          {nextProgram?.title ?? "Sin programación próxima"}
        </Text>

        {nextProgram && (
          <Text style={{ color: "#184f92", marginTop: 2 }}>
            {nextProgram.start} – {nextProgram.end}
          </Text>
        )}
      </View>

      <Text
        style={{
          fontSize: 11,
          opacity: 0.6,
          marginTop: 8,
        }}
      >
        Hora oficial: República Dominicana (UTC-4)
      </Text>
    </View>
  );
}