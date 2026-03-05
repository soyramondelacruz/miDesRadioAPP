// src/components/UpcomingProgramsCarousel.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { Feather } from "@expo/vector-icons";

import { spacing } from "../theme";
import { weeklySchedule, STATION_TIMEZONE, Program } from "../data/schedule";
import { getProgramVisuals } from "../data/programVisuals";
import { useRadioPlayer } from "../context/RadioPlayerContext";

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function isNowInProgram(nowMin: number, start: number, end: number) {
  if (end > start) return nowMin >= start && nowMin < end;
  return nowMin >= start || nowMin < end; // cruza medianoche
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

function getCurrentAndUpcoming(day: number, minutes: number) {
  const today = weeklySchedule[day] ?? [];
  const nextDay = weeklySchedule[(day + 1) % 7] ?? [];

  // current
  let current: Program | null = null;
  for (const p of today) {
    const s = timeToMinutes(p.start);
    const e = timeToMinutes(p.end);
    if (isNowInProgram(minutes, s, e)) {
      current = p;
      break;
    }
  }

  // upcoming de hoy (por start >= now)
  const upcomingToday: Program[] = [];
  for (const p of today) {
    const s = timeToMinutes(p.start);
    if (minutes <= s) upcomingToday.push(p);
  }

  // evita duplicar el mismo bloque horario del current (NO por id)
  const cleanedToday = upcomingToday.filter(
    (p) => !(p.start === current?.start && p.end === current?.end && p.title === current?.title)
  );

  // si no alcanzamos 6, completamos con el inicio del día siguiente
  const need = 6 - cleanedToday.length;
  const takeFromNext = need > 0 ? nextDay.slice(0, need) : [];

  return { current, upcoming: [...cleanedToday, ...takeFromNext].slice(0, 6) };
}

type Props = {
  title?: string;
  onOpenProgramMenu?: (program: Program) => void; // conecta tu SlidingSheet
};

export function UpcomingProgramsCarousel({
  title = "Lo que viene",
  onOpenProgramMenu,
}: Props) {
  const { simulatedISOTime } = useRadioPlayer();

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const baseDate = useMemo(() => {
    return simulatedISOTime ? new Date(simulatedISOTime) : new Date();
  }, [simulatedISOTime, tick]);

  const { day, minutes } = useMemo(() => getStationNow(baseDate), [baseDate]);
  const { upcoming } = useMemo(() => getCurrentAndUpcoming(day, minutes), [day, minutes]);

  if (!upcoming.length) {
    return (
      <View style={{ marginTop: 18 }}>
        <Text style={{ fontSize: 16, fontWeight: "900", color: "#FFFFFF" }}>{title}</Text>
        <Text style={{ marginTop: 8, color: "rgba(255,255,255,0.65)", fontWeight: "700" }}>
          Aún no hay programación cargada para este día.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 18 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "900",
          color: "#FFFFFF",
          marginBottom: 12,
        }}
      >
        {title}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingBottom: 6 }}
      >
        {upcoming.map((p) => {
          const { artwork } = getProgramVisuals(p);
          const meta = p.host ? `${p.start} – ${p.end} • ${p.host}` : `${p.start} – ${p.end}`;

          return (
            <View
              key={p.id}
              style={{
                width: 280,
                borderRadius: 18,
                overflow: "hidden",
                backgroundColor: "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", padding: 14, gap: 12 }}>
                {/* Artwork */}
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 14,
                    overflow: "hidden",
                    backgroundColor: "rgba(156,195,255,0.12)",
                    borderWidth: 1,
                    borderColor: "rgba(156,195,255,0.18)",
                  }}
                >
                  <Image source={artwork} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                </View>

                {/* Text */}
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: "900", color: "#FFFFFF" }}>
                    {p.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      fontWeight: "800",
                      color: "rgba(255,255,255,0.72)",
                    }}
                  >
                    {meta}
                  </Text>
                </View>

                {/* 3 dots */}
                <Pressable
                  onPress={() => onOpenProgramMenu?.(p)}
                  style={({ pressed }) => ({
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: pressed ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.10)",
                  })}
                >
                  <Feather name="more-horizontal" size={18} color="rgba(255,255,255,0.85)" />
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}