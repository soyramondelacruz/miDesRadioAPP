// src/components/UpcomingProgramsCarousel.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Share,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";

import { STATION_TIMEZONE, weeklySchedule, Program } from "../data/schedule";
import { getProgramVisuals } from "../data/programVisuals";
import { useRadioPlayer } from "../context/RadioPlayerContext";

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function isNowInProgram(nowMin: number, start: number, end: number) {
  if (end > start) return nowMin >= start && nowMin < end;
  return nowMin >= start || nowMin < end;
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

  let current: Program | null = null;
  for (const p of today) {
    const s = timeToMinutes(p.start);
    const e = timeToMinutes(p.end);
    if (isNowInProgram(minutes, s, e)) {
      current = p;
      break;
    }
  }

  const upcoming: Program[] = [];
  for (const p of today) {
    const s = timeToMinutes(p.start);
    if (minutes <= s) upcoming.push(p);
  }

  if (upcoming.length === 0) upcoming.push(...today.slice(0, 6));

  const cleaned = upcoming.filter((p) => p.id !== current?.id);
  return { current, upcoming: cleaned.slice(0, 6) };
}

function getNextOccurrenceForBlock(program: Program, now: Date, dayIndex: number) {
  const dayDiff = (dayIndex - now.getDay() + 7) % 7;
  const [h, m] = program.start.split(":").map(Number);

  const next = new Date(now);
  next.setHours(h, m, 0, 0);
  next.setDate(now.getDate() + dayDiff);

  if (dayDiff === 0 && next <= now) {
    next.setDate(next.getDate() + 7);
  }

  return next;
}

async function requestNotificationPermissions() {
  const settings = await Notifications.getPermissionsAsync();

  let finalStatus = settings.status;
  if (finalStatus !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    finalStatus = requested.status;
  }

  return finalStatus === "granted";
}

type Props = {
  title?: string;
  programs?: Program[];
  currentProgram?: Program | null;
};

export function UpcomingProgramsCarousel({
  title = "Lo que viene",
  programs,
}: Props) {
  const navigation = useNavigation<any>();
  const { simulatedISOTime } = useRadioPlayer();

  const [tick, setTick] = useState(0);
  const [scheduledByProgramId, setScheduledByProgramId] = useState<Record<string, string>>({});
  const [schedulingProgramId, setSchedulingProgramId] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadScheduledNotifications() {
      try {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        const map: Record<string, string> = {};

        for (const item of scheduled) {
          const pid = item.content.data?.programId;
          if (typeof pid === "string") {
            map[pid] = item.identifier;
          }
        }

        if (mounted) setScheduledByProgramId(map);
      } catch (error) {
        console.log("Load scheduled notifications error:", error);
      }
    }

    loadScheduledNotifications();

    return () => {
      mounted = false;
    };
  }, []);

  const baseDate = useMemo(() => {
    return simulatedISOTime ? new Date(simulatedISOTime) : new Date();
  }, [simulatedISOTime, tick]);

  const { day, minutes } = useMemo(() => getStationNow(baseDate), [baseDate]);
  const derived = useMemo(() => getCurrentAndUpcoming(day, minutes), [day, minutes]);
  const upcoming = programs ?? derived.upcoming;

  async function handleScheduleProgram(program: Program) {
    try {
      if (schedulingProgramId) return;
      setSchedulingProgramId(program.id);

      const existingId = scheduledByProgramId[program.id];
      if (existingId) {
        await Notifications.cancelScheduledNotificationAsync(existingId);
        setScheduledByProgramId((prev) => {
          const next = { ...prev };
          delete next[program.id];
          return next;
        });

        Alert.alert("Recordatorio eliminado", `Ya no te avisaremos sobre ${program.title}.`);
        return;
      }

      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          "Permiso requerido",
          "Activa las notificaciones para que podamos recordarte este bloque."
        );
        return;
      }

      const now = new Date();
      const nextOccurrence = getNextOccurrenceForBlock(program, now, day);
      const fiveMinutesBefore = new Date(nextOccurrence.getTime() - 5 * 60 * 1000);
      const reminderDate =
        fiveMinutesBefore > now ? fiveMinutesBefore : new Date(Date.now() + 10000);

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: program.title,
          body:
            fiveMinutesBefore > now
              ? `Comienza en 5 minutos • ${program.start} - ${program.end}`
              : `Comienza pronto • ${program.start} - ${program.end}`,
          sound: true,
          data: {
            screen: "ProgramDetail",
            programId: program.id,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminderDate,
        },
      });

      setScheduledByProgramId((prev) => ({
        ...prev,
        [program.id]: identifier,
      }));

      Alert.alert(
        "Recordatorio activado",
        fiveMinutesBefore > now
          ? `Te avisaremos 5 minutos antes de que comience ${program.title}.`
          : `Te avisaremos en breve porque ${program.title} está próximo a comenzar.`
      );
    } catch (error) {
      console.log("Schedule upcoming notification error:", error);
      Alert.alert(
        "No se pudo programar",
        "Ocurrió un problema al crear el recordatorio."
      );
    } finally {
      setSchedulingProgramId(null);
    }
  }

  async function handleShareProgram(program: Program) {
    try {
      await Share.share({
        message: `${program.title} • ${program.start} - ${program.end}${program.host ? ` • ${program.host}` : ""}\nEscúchalo en miDes Radio.`,
      });
    } catch (error) {
      console.log("Share program error:", error);
    }
  }

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
          const isScheduled = !!scheduledByProgramId[p.id];
          const isScheduling = schedulingProgramId === p.id;

          return (
            <View
              key={p.id}
              style={{
                width: 300,
                borderRadius: 18,
                overflow: "hidden",
                backgroundColor: "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
              }}
            >
              <Pressable
                onPress={() => navigation.navigate("ProgramDetail", { programId: p.id })}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.96 : 1,
                })}
              >
                <View style={{ flexDirection: "row", alignItems: "center", padding: 14, gap: 12 }}>
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

                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 16, fontWeight: "900", color: "#FFFFFF" }}
                    >
                      {p.title}
                    </Text>

                    <View
                      style={{
                        marginTop: 4,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{
                          flex: 1,
                          fontSize: 12,
                          fontWeight: "800",
                          color: "rgba(255,255,255,0.72)",
                        }}
                      >
                        {meta}
                      </Text>

                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          handleScheduleProgram(p);
                        }}
                        disabled={isScheduling}
                        hitSlop={8}
                        style={({ pressed }) => ({
                          width: 30,
                          height: 30,
                          borderRadius: 10,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: pressed
                            ? "rgba(255,255,255,0.10)"
                            : isScheduled
                            ? "rgba(156,195,255,0.14)"
                            : "rgba(255,255,255,0.06)",
                          borderWidth: 1,
                          borderColor: isScheduled
                            ? "rgba(156,195,255,0.22)"
                            : "rgba(255,255,255,0.10)",
                          opacity: isScheduling ? 0.7 : 1,
                        })}
                      >
                        <Feather
                          name={isScheduled ? "check" : "clock"}
                          size={15}
                          color={isScheduled ? "#9CC3FF" : "rgba(255,255,255,0.82)"}
                        />
                      </Pressable>

                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          handleShareProgram(p);
                        }}
                        hitSlop={8}
                        style={({ pressed }) => ({
                          width: 30,
                          height: 30,
                          borderRadius: 10,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: pressed ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
                          borderWidth: 1,
                          borderColor: "rgba(255,255,255,0.10)",
                        })}
                      >
                        <Feather name="share-2" size={15} color="rgba(255,255,255,0.82)" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}