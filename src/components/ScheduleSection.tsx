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
  // cruza medianoche
  return currentMinutes >= start || currentMinutes < end;
}

function getProgramProgress(currentMinutes: number, start: number, end: number) {
  let duration: number;
  let elapsed: number;

  if (end > start) {
    duration = end - start;
    elapsed = currentMinutes - start;
  } else {
    // cruza medianoche
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
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: STATION_TIMEZONE,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  });

  const parts = formatter.formatToParts(baseDate);

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const weekdayStr = parts.find((p) => p.type === "weekday")?.value ?? "Mon";

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return { day: weekdayMap[weekdayStr], minutes: hour * 60 + minute };
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

  // si no hay "current", buscamos el próximo (el primer start > now)
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

function formatRemainingLabel(remaining: number) {
  if (remaining <= 0) return "Finaliza ahora";
  if (remaining === 1) return "Finaliza en 1 minuto";
  return `Faltan ${remaining} minutos`;
}

export function ScheduleSection() {
  const { simulatedISOTime } = useRadioPlayer();

  // ✅ baseDate real o simulado
  const baseDate = useMemo(() => {
    return simulatedISOTime ? new Date(simulatedISOTime) : new Date();
  }, [simulatedISOTime]);

  // ✅ "tick" para que el progreso se recalule cuando el tiempo avanza
  const [tick, setTick] = useState(0);

  // ✅ hora estación derivada del baseDate (RD timezone)
  const stationNow = useMemo(() => getStationNow(baseDate), [baseDate, tick]);
  const { day, minutes } = stationNow;

  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
  const [nextProgram, setNextProgram] = useState<Program | null>(null);

  // ✅ recalcula inmediatamente al cambiar hora simulada (o al avanzar tick)
  useEffect(() => {
    const { current, next } = getCurrentAndNextProgram(day, minutes);
    setCurrentProgram(current);
    setNextProgram(next);
  }, [day, minutes]);

  // ✅ refresca cada 60s para progreso/tiempo real
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

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
      {/* EN ESTE MOMENTO */}
      <View>
        <Text
          style={{
            fontSize: 12,
            color: colors.primary,
            fontWeight: "700",
            letterSpacing: 1,
          }}
        >
          EN ESTE MOMENTO
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "800",
            color: "#38455c",
            marginTop: 6,
          }}
        >
          {currentProgram?.title ?? "Música Continua"}
        </Text>

        {/* Host (si existe) */}
        {currentProgram?.host ? (
          <Text style={{ color: "#184f92", marginTop: 4, fontSize: 13, fontWeight: "600" }}>
            {currentProgram.host}
          </Text>
        ) : null}

        {currentProgram ? (
          <>
            <Text style={{ color: "#184f92", marginTop: 4 }}>
              {currentProgram.start} – {currentProgram.end}
            </Text>

            {/* Barra de progreso */}
            <View
              style={{
                marginTop: 10,
                height: 6,
                backgroundColor: "rgba(0,0,0,0.08)",
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
            <Text
              style={{
                fontSize: 12,
                color: "#6b7280",
                marginTop: 8,
              }}
            >
              {formatRemainingLabel(remaining)}
            </Text>
          </>
        ) : (
          <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
            Sin programación activa. (Modo música continua)
          </Text>
        )}
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: "rgba(0,0,0,0.08)" }} />

      {/* PRÓXIMO */}
      <View>
        <Text
          style={{
            fontSize: 12,
            color: colors.accent,
            fontWeight: "700",
            letterSpacing: 1,
          }}
        >
          PRÓXIMO
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "800",
            color: "#38455c",
            marginTop: 6,
          }}
        >
          {nextProgram?.title ?? "Sin programación próxima"}
        </Text>

        {/* Host (si existe) */}
        {nextProgram?.host ? (
          <Text style={{ color: "#184f92", marginTop: 4, fontSize: 13, fontWeight: "600" }}>
            {nextProgram.host}
          </Text>
        ) : null}

        {nextProgram ? (
          <Text style={{ color: "#184f92", marginTop: 4 }}>
            {nextProgram.start} – {nextProgram.end}
          </Text>
        ) : null}
      </View>

      <Text style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>
        Hora oficial: República Dominicana (UTC-4)
      </Text>
    </View>
  );
}