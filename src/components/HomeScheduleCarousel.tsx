import React, { useMemo, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { spacing } from "../theme";
import { weeklySchedule, Program, STATION_TIMEZONE } from "../data/schedule";
import { useRadioPlayer } from "../context/RadioPlayerContext";


type SlotKind = "now" | "next" | "later";

type Slot = {
  kind: SlotKind;
  program: Program | null;
  dayIndex: number; // 0..6
};

const SCREEN_W = Dimensions.get("window").width;

// ✅ compact / cuadrado
const CARD_H = 70;
const CARD_W = Math.min(210, Math.round(SCREEN_W * 0.60));

const MEDIA_W = 54;
const RADIUS = 16;

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function isNowInProgram(currentMinutes: number, start: number, end: number) {
  if (end > start) return currentMinutes >= start && currentMinutes < end;
  return currentMinutes >= start || currentMinutes < end;
}

function getStationNow(baseDate: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: STATION_TIMEZONE,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  });

  const parts = fmt.formatToParts(baseDate);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "Mon";

  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return { day: map[wd], minutes: hour * 60 + minute };
}

function getUpcomingPrograms(baseDate: Date, count = 5): { slots: Slot[] } {
  const { day, minutes } = getStationNow(baseDate);

  const getDayList = (d: number) => weeklySchedule[d] ?? [];
  const today = getDayList(day);

  let currentIndex = -1;
  let current: Program | null = null;

  for (let i = 0; i < today.length; i++) {
    const p = today[i];
    const start = timeToMinutes(p.start);
    const end = timeToMinutes(p.end);
    if (isNowInProgram(minutes, start, end)) {
      current = p;
      currentIndex = i;
      break;
    }
  }

  const slots: Slot[] = [];
  slots.push({ kind: "now", program: current, dayIndex: day });

  let needed = count - 1;

  if (today.length > 0) {
    if (currentIndex >= 0) {
      for (let i = currentIndex + 1; i < today.length && needed > 0; i++) {
        slots.push({
          kind: slots.length === 1 ? "next" : "later",
          program: today[i],
          dayIndex: day,
        });
        needed--;
      }
    } else {
      let startAt = -1;
      for (let i = 0; i < today.length; i++) {
        const start = timeToMinutes(today[i].start);
        if (minutes < start) {
          startAt = i;
          break;
        }
      }
      if (startAt >= 0) {
        for (let i = startAt; i < today.length && needed > 0; i++) {
          slots.push({
            kind: slots.length === 1 ? "next" : "later",
            program: today[i],
            dayIndex: day,
          });
          needed--;
        }
      }
    }
  }

  for (let offset = 1; offset <= 7 && needed > 0; offset++) {
    const d = (day + offset) % 7;
    const list = getDayList(d);
    for (let i = 0; i < list.length && needed > 0; i++) {
      slots.push({
        kind: slots.length === 1 ? "next" : "later",
        program: list[i],
        dayIndex: d,
      });
      needed--;
    }
  }

  while (slots.length < count) {
    slots.push({
      kind: slots.length === 1 ? "next" : "later",
      program: null,
      dayIndex: day,
    });
  }

  return { slots: slots.slice(0, count) };
}

function kindLabel(kind: SlotKind) {
  if (kind === "now") return "AHORA";
  if (kind === "next") return "PRÓXIMO";
  return "LUEGO";
}


export function HomeScheduleCarousel({ onOpenRadio }: { onOpenRadio?: () => void }) {
  const navigation = useNavigation<any>();
  const { effectiveNow, now } = useRadioPlayer();

  const { slots } = useMemo(() => getUpcomingPrograms(effectiveNow, 5), [effectiveNow]);

  const isLive = !!now.data?.isLive;
  const liveTitle =
    now.data?.show?.title ?? now.data?.track?.title ?? now.data?.station ?? null;
  const liveHost =
    now.data?.show?.host ?? now.data?.track?.artist ?? null;

  function openRadio() {
    if (onOpenRadio) onOpenRadio();
    else navigation.navigate("Radio");
  }

  const snapInterval = CARD_W + spacing.sm;

  // ✅ para dots
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={{ gap: 10 }}>
            <View
        style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        }}
        >
        <Text
            style={{
            fontSize: 13,
            fontWeight: "900",
            color: "rgba(255,255,255,0.88)",
            letterSpacing: 1.4,
            }}
        >
            PROGRAMACIÓN
        </Text>

        <Pressable
        onPress={openRadio}
        hitSlop={10}
        style={({ pressed }) => ({
            paddingVertical: 2,
            opacity: pressed ? 0.75 : 0.55,
        })}
        >
        <Text
            style={{
            fontSize: 11,
            fontWeight: "800",
            color: "rgba(156,195,255,0.78)",
            letterSpacing: 0.2,
            }}
        >
            Abrir
        </Text>
        </Pressable>
        </View>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snapInterval}
        snapToAlignment="start"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingRight: spacing.lg,
          gap: spacing.sm,
        }}
      >
        {slots.map((slot, idx) => {
          const p = slot.program;

          let title =
            p?.title ?? (slot.kind === "now" ? "Música continua" : "Sin programación");

          const host =
            slot.kind === "now"
              ? (liveHost ?? "")
              : "";

          if (slot.kind === "now" && !p && liveTitle) title = liveTitle;

          return (
            <Pressable
              key={`${slot.kind}-${idx}-${p?.id ?? "none"}`}
              onPress={openRadio}
              style={({ pressed }) => ({
                width: CARD_W,
                height: CARD_H,
                borderRadius: "14",
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,

                backgroundColor:
                  slot.kind === "now"
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(255,255,255,0.06)",

                borderWidth: 1,
                borderColor:
                  slot.kind === "now"
                    ? "rgba(156,195,255,0.55)"
                    : "rgba(255,255,255,0.10)",

                opacity: pressed ? 0.95 : 1,
              })}
            >
              {/* Zona logo/foto (placeholder premium) */}
              <View
                style={{
                  width: MEDIA_W,
                  height: MEDIA_W,
                  borderRadius: 12,
                  backgroundColor:
                    slot.kind === "now"
                      ? "rgba(156,195,255,0.18)"
                      : "rgba(255,255,255,0.08)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.10)",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {/* Badge AHORA/PRÓXIMO/LUEGO */}
                <View
                  style={{
                    position: "absolute",
                    top: 6,
                    left: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 999,
                    backgroundColor: "rgba(0,0,0,0.25)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.10)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: "900",
                      color: "rgba(255,255,255,0.90)",
                      letterSpacing: 0.6,
                    }}
                  >
                    {kindLabel(slot.kind)}
                  </Text>
                </View>

                {/* Live badge */}
                {slot.kind === "now" && isLive ? (
                  <View
                    style={{
                      position: "absolute",
                      bottom: 6,
                      left: 6,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 999,
                      backgroundColor: "rgba(0,0,0,0.25)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.10)",
                    }}
                  >
                    <View style={{ width: 6, height: 6, borderRadius: 99, backgroundColor: "#FF4D4D" }} />
                    <Text style={{ fontSize: 9, fontWeight: "900", color: "rgba(255,255,255,0.90)" }}>
                      LIVE
                    </Text>
                  </View>
                ) : null}

                {/* Inicial placeholder */}
                <Text style={{ fontSize: 18, fontWeight: "900", color: "rgba(255,255,255,0.85)" }}>
                  {title?.trim()?.[0]?.toUpperCase() ?? "M"}
                </Text>
              </View>

              {/* Texto centrado */}
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: "900",
                    color: "#FFFFFF",
                    letterSpacing: -0.2,
                  }}
                >
                  {title}
                </Text>

                {!!host ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      textAlign: "center",
                      marginTop: 4,
                      fontSize: 11,
                      fontWeight: "800",
                      color: "rgba(255,255,255,0.68)",
                    }}
                  >
                    {host}
                  </Text>
                ) : (
                  <Text
                    numberOfLines={1}
                    style={{
                      textAlign: "center",
                      marginTop: 4,
                      fontSize: 11,
                      fontWeight: "800",
                      color: "rgba(255,255,255,0.52)",
                    }}
                  >
                    {p ? `${p.start}–${p.end}` : " "}
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </Animated.ScrollView>

      {/* ✅ PUNTITOS */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 6,
          marginTop: 6,
        }}
      >
        {slots.map((_, i) => {
          const inputRange = [
            (i - 1) * snapInterval,
            i * snapInterval,
            (i + 1) * snapInterval,
          ];

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.25, 1, 0.25],
            extrapolate: "clamp",
          });

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.35, 1],
            extrapolate: "clamp",
          });

          const width = scrollX.interpolate({
            inputRange,
            outputRange: [5, 18, 5],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={`dot-${i}`}
              style={{
                width,
                height: 5,
                borderRadius: 99,
                backgroundColor: "#9CC3FF",
                opacity,
                
                
              }}
            />
          );
        })}
      </View>
    </View>
  );
}