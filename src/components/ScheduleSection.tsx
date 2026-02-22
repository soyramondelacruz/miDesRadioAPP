import React, { useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { colors, spacing } from "../theme";
import { weeklySchedule, Program, STATION_TIMEZONE } from "../data/schedule";
import { useRadioPlayer } from "../context/RadioPlayerContext";

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isNowInProgram(currentMinutes: number, start: number, end: number) {
  if (end > start) return currentMinutes >= start && currentMinutes < end;
  // Cruza medianoche
  return currentMinutes >= start || currentMinutes < end;
}

function getProgramProgress(currentMinutes: number, start: number, end: number) {
  let duration: number;
  let elapsed: number;

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

function getRemainingMinutes(currentMinutes: number, start: number, end: number) {
  if (end > start) return end - currentMinutes;
  if (currentMinutes >= start) return 1440 - currentMinutes + end;
  return end - currentMinutes;
}

function getStationNow(baseDate: Date) {
  // NOTE: Hermes/Intl a veces puede comportarse raro en simulador.
  // Hacemos fallbacks sólidos.
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: STATION_TIMEZONE,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  });

  const parts = formatter.formatToParts(baseDate);

  const hourStr = parts.find((p) => p.type === "hour")?.value;
  const minuteStr = parts.find((p) => p.type === "minute")?.value;
  const weekdayStr = parts.find((p) => p.type === "weekday")?.value;

  const hour = hourStr != null ? Number(hourStr) : baseDate.getHours();
  const minute = minuteStr != null ? Number(minuteStr) : baseDate.getMinutes();

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const day =
    weekdayStr && weekdayMap[weekdayStr] !== undefined
      ? weekdayMap[weekdayStr]
      : baseDate.getDay();

  return { day, minutes: hour * 60 + minute };
}

function getCurrentAndNextProgram(day: number, minutes: number) {
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
  const { simulatedISOTime } = useRadioPlayer();

  // ✅ Tick solo para modo REAL TIME (cada minuto).
  // En modo SIMULATED, NO hacemos interval (el usuario “mueve” el tiempo manualmente).
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (simulatedISOTime) return;

    const id = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, [simulatedISOTime]);

  const baseDate = useMemo(() => {
    return simulatedISOTime ? new Date(simulatedISOTime) : new Date();
    // tick fuerza recalcular cada minuto en modo real
  }, [simulatedISOTime, tick]);

  const { day, minutes } = useMemo(() => getStationNow(baseDate), [baseDate]);

  const { current, next } = useMemo(() => {
    return getCurrentAndNextProgram(day, minutes);
  }, [day, minutes]);

  const { progress, remaining } = useMemo(() => {
    if (!current) return { progress: 0, remaining: 0 };

    const start = timeToMinutes(current.start);
    const end = timeToMinutes(current.end);

    return {
      progress: getProgramProgress(minutes, start, end),
      remaining: getRemainingMinutes(minutes, start, end),
    };
  }, [current, minutes]);

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
          {current?.title ?? "Música Continua"}
        </Text>

        {current ? (
          <>
            <Text style={{ color: "#184f92", marginTop: 2 }}>
              {current.start} – {current.end}
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
            {remaining > 0 ? (
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                {remaining === 1
                  ? "Finaliza en 1 minuto"
                  : `Faltan ${remaining} minutos`}
              </Text>
            ) : null}
          </>
        ) : (
          <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            Programación por bloques. Próximo contenido más abajo.
          </Text>
        )}
      </View>

      <View style={{ height: 1, backgroundColor: "#eaeaea" }} />

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
          {next?.title ?? "Sin programación próxima"}
        </Text>

        {next ? (
          <Text style={{ color: "#184f92", marginTop: 2 }}>
            {next.start} – {next.end}
          </Text>
        ) : null}
      </View>

      <Text style={{ fontSize: 11, opacity: 0.6, marginTop: 8 }}>
        Hora oficial: República Dominicana (UTC-4)
      </Text>
    </View>
  );
}