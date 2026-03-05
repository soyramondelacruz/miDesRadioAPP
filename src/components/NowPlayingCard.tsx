// src/components/NowPlayingCard.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image } from "react-native";
import { spacing } from "../theme";
import { weeklySchedule, STATION_TIMEZONE, Program, SCHEDULE_DEBUG } from "../data/schedule";
import { getProgramVisuals } from "../data/programVisuals";

function safeText(v?: string | null) {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function isNowInProgram(nowMin: number, start: number, end: number) {
  if (end > start) return nowMin >= start && nowMin < end;
  // cruza medianoche
  return nowMin >= start || nowMin < end;
}

function getProgramProgress(nowMin: number, start: number, end: number) {
  let duration = 0;
  let elapsed = 0;

  if (end > start) {
    duration = end - start;
    elapsed = nowMin - start;
  } else {
    // cruza medianoche
    duration = 1440 - start + end;
    elapsed = nowMin >= start ? nowMin - start : 1440 - start + nowMin;
  }

  if (duration <= 0) return 0;
  return Math.max(0, Math.min(1, elapsed / duration));
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
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  return { day: weekdayMap[weekdayStr], minutes: hour * 60 + minute };
}

function getCurrentProgramAndProgress(day: number, minutes: number) {
  const today = weeklySchedule[day] ?? [];

  for (const p of today) {
    const s = timeToMinutes(p.start);
    const e = timeToMinutes(p.end);
    if (isNowInProgram(minutes, s, e)) {
      return {
        current: p,
        progress: getProgramProgress(minutes, s, e),
        label: `${p.start} – ${p.end}`,
      };
    }
  }

  return { current: null as Program | null, progress: 0, label: "Música continua" };
}

type Props = {
  isPlaying?: boolean;
  /** si luego quieres override por API, puedes pasar title/subtitle aquí */
  title?: string;
  subtitle?: string;
};

export function NowPlayingCard({ isPlaying = false, title, subtitle }: Props) {
  // refresco suave del progreso
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const baseDate = useMemo(() => {
    if (SCHEDULE_DEBUG.enabled && SCHEDULE_DEBUG.simulatedISOTime) {
      return new Date(SCHEDULE_DEBUG.simulatedISOTime);
    }
    return new Date();
  }, [tick]);

  const derived = useMemo(() => {
    const { day, minutes } = getStationNow(baseDate);
    const { current, progress, label } = getCurrentProgramAndProgress(day, minutes);

    if (!current) {
      return {
        current: null as Program | null,
        artwork: getProgramVisuals(null).artwork,
        title: "Música continua",
        subtitle: "miDes Radio • 24/7",
        progress,
        label,
      };
    }

    const v = getProgramVisuals(current);
    return {
      current,
      artwork: v.artwork,
      title: safeText(current.title) ?? "miDes Radio",
      subtitle: safeText(current.host) ?? label,
      progress,
      label,
    };
  }, [baseDate]);

  const finalTitle = safeText(title) ?? derived.title;
  const finalSubtitle = safeText(subtitle) ?? derived.subtitle;

  const pct = useMemo(() => {
    const p = Number.isFinite(derived.progress) ? derived.progress : 0;
    return Math.max(0, Math.min(1, p));
  }, [derived.progress]);

  const CARD_H = 170;
  const ART_WRAP = 122;

  return (
    <View
      style={{
        marginTop: 25,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.55)",
        shadowColor: "#000",
        shadowOpacity: 0.16,
        shadowRadius: 26,
        shadowOffset: { width: 0, height: 14 },
        elevation: 14,
      }}
    >
      <View style={{ flexDirection: "row", height: CARD_H }}>
        {/* Artwork */}
        <View
          style={{
            width: 140,
            height: CARD_H,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
          }}
        >
          <View
            style={{
              width: ART_WRAP,
              height: ART_WRAP,
              borderRadius: 14,
              padding: 6,
              backgroundColor: "#FFFFFF",
              shadowColor: "#000",
              shadowOpacity: 0.10,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 5 },
              elevation: 6,
            }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: 10,
                overflow: "hidden",
                backgroundColor: "#0E1624",
              }}
            >
              <Image source={derived.artwork} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            </View>
          </View>
        </View>

        {/* Info */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.lg,
          }}
        >
          {/* LIVE/OFFLINE */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 6,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 99,
                backgroundColor: isPlaying ? "#EF4444" : "rgba(14,22,36,0.30)",
              }}
            />
            <Text
              style={{
                fontSize: 9,
                fontWeight: "800",
                letterSpacing: 0.3,
                color: isPlaying ? "#EF4444" : "rgba(14,22,36,0.45)",
              }}
            >
              {isPlaying ? "LIVE" : "OFFLINE"}
            </Text>
          </View>

          <Text
            numberOfLines={1}
            style={{
              marginTop: 8,
              fontSize: 16,
              fontWeight: "900",
              color: "#0E1624",
              letterSpacing: -0.3,
            }}
          >
            {finalTitle}
          </Text>

          <Text
            numberOfLines={1}
            style={{
              marginTop: 4,
              fontSize: 12,
              fontWeight: "700",
              color: "rgba(14,22,36,0.70)",
            }}
          >
            {finalSubtitle}
          </Text>

          {/* Progress */}
          <View style={{ marginTop: 12 }}>
            <View
              style={{
                height: 8,
                borderRadius: 999,
                backgroundColor: "rgba(31,95,174,0.14)",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${pct * 100}%`,
                  height: "100%",
                  backgroundColor: "#1F5FAE",
                }}
              />
            </View>

            <Text
              style={{
                marginTop: 6,
                fontSize: 11,
                fontWeight: "800",
                color: "rgba(14,22,36,0.55)",
              }}
            >
              {derived.label}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}