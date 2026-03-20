// src/screens/ProgramDetailScreen.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";

import { spacing } from "../theme";
import { getProgramVisuals } from "../data/programVisuals";
import { resolveProgramById } from "../utils/programs";
import { useRadioPlayer } from "../context/RadioPlayerContext";
import { STATION_TIMEZONE } from "../data/schedule";

function getNextOccurrence(program: any, now: Date) {
  const dayDiff = (program.dayIndex - now.getDay() + 7) % 7;

  const [h, m] = program.start.split(":").map(Number);

  const next = new Date(now);
  next.setHours(h, m, 0, 0);
  next.setDate(now.getDate() + dayDiff);

  // Si es hoy pero ya pasó la hora → ir a la próxima semana
  if (dayDiff === 0 && next <= now) {
    next.setDate(next.getDate() + 7);
  }

  return next;
}

function getTimeUntil(next: Date, now: Date) {
  const diffMs = next.getTime() - now.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `Empieza en ${minutes} min`;
  if (hours < 24) return `Empieza en ${hours} h ${minutes % 60} min`;
  if (days === 1) return "Empieza mañana";
  return `Empieza en ${days} días`;
}

type RouteParams = {
  programId: string;
};

function getKindLabel(kind?: "music" | "show") {
  return kind === "music" ? "Música" : "Programa";
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
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

  return {
    day: weekdayMap[weekdayStr],
    minutes: hour * 60 + minute,
  };
}

function isNowInProgram(nowMin: number, start: number, end: number) {
  if (end > start) return nowMin >= start && nowMin < end;
  return nowMin >= start || nowMin < end;
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

export function ProgramDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { effectiveNow } = useRadioPlayer();

  const [isReminderScheduled, setIsReminderScheduled] = useState(false);
  const [isSchedulingReminder, setIsSchedulingReminder] = useState(false);

  const { programId } = (route.params ?? {}) as RouteParams;

  const program = useMemo(() => {
    if (!programId) return null;
    return resolveProgramById(programId);
  }, [programId]);

  const visual = useMemo(() => {
    return getProgramVisuals(program as any);
  }, [program]);

  const canShowEpisodes = program?.kind === "show";

  const isLiveNow = useMemo(() => {
    if (!program) return false;

    const { day, minutes } = getStationNow(new Date(effectiveNow));
    if (program.dayIndex !== day) return false;

    const start = timeToMinutes(program.start);
    const end = timeToMinutes(program.end);

    return isNowInProgram(minutes, start, end);
  }, [program, effectiveNow]);

  const nextEmission = useMemo(() => {
    if (!program) return null;
    return getNextOccurrence(program, new Date(effectiveNow));
  }, [program, effectiveNow]);

  const startsInLabel = useMemo(() => {
    if (!nextEmission || isLiveNow) return null;
    return getTimeUntil(nextEmission, new Date(effectiveNow));
  }, [nextEmission, effectiveNow, isLiveNow]);

  const scheduleLine = useMemo(() => {
    if (!program) return "";
    return `${program.dayLabel} • ${program.start} – ${program.end}`;
  }, [program]);

  const handleGoToRadio = () => {
    navigation.navigate("Tabs", { screen: "Radio" });
  };

  const handleScheduleProgram = async () => {
  if (!program || !nextEmission || isSchedulingReminder) return;

  try {
    setIsSchedulingReminder(true);

    const granted = await requestNotificationPermissions();
    if (!granted) {
      Alert.alert(
        "Permiso requerido",
        "Activa las notificaciones para que podamos recordarte este programa."
      );
      return;
    }

    const now = new Date();
    const triggerDate = new Date(nextEmission.getTime() - 5 * 60 * 1000);

    // Si ya faltan menos de 5 minutos, programa en 10 segundos para no perder el recordatorio
    const finalTriggerDate = triggerDate > now
      ? triggerDate
      : new Date(Date.now() + 10000);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: program.title,
          body:
            triggerDate > now
              ? `Comienza en 5 minutos • ${program.dayLabel} ${program.start}`
              : `Comienza pronto • ${program.dayLabel} ${program.start}`,
          sound: true,
          data: {
            screen: "ProgramDetail",
            programId: program.id,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: finalTriggerDate,
        },
      });

    setIsReminderScheduled(true);

  
      Alert.alert(
      "Recordatorio activado",
      triggerDate > now
        ? `${program.title}\nTe avisaremos 5 minutos antes de que comience.`
        : `${program.title}\nTe avisaremos en breve porque ya está próximo a comenzar.`
    );
   
  } catch (error) {
    console.log("Schedule notification error:", error);
    Alert.alert(
      "No se pudo programar",
      "Ocurrió un problema al crear el recordatorio."
    );
  } finally {
    setIsSchedulingReminder(false);
  }
};

  if (!program) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0E1624", paddingTop: insets.top }}>
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: 12 }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: pressed ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
            })}
          >
            <Feather name="arrow-left" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: spacing.xl,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 20,
              fontWeight: "900",
              textAlign: "center",
            }}
          >
            Programa no encontrado
          </Text>

          <Text
            style={{
              marginTop: 8,
              color: "rgba(255,255,255,0.72)",
              fontSize: 14,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            No pudimos encontrar la información de este programa.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0E1624" }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <LinearGradient
          colors={["#0B1220", "#1E4F93", "#1F5FAE", "#163A6B", "#0E1624"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1.2 }}
          style={{
            paddingTop: insets.top + 8,
            paddingHorizontal: spacing.lg,
            paddingBottom: 30,
            overflow: "hidden",
          }}
        >
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              right: -16,
              top: -18,
              width: 190,
              height: 190,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.07)",
              transform: [{ rotate: "18deg" }],
            }}
          />
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              right: 30,
              top: 30,
              width: 110,
              height: 110,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => ({
                width: 42,
                height: 42,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: pressed ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.10)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.14)",
              })}
            >
              <Feather name="arrow-left" size={18} color="#FFFFFF" />
            </Pressable>

            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: "900",
                fontSize: 16,
              }}
            >
              Programa
            </Text>

            <View style={{ width: 42 }} />
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: -8 }}>
          <View
            style={{
              borderRadius: 22,
              overflow: "hidden",
              backgroundColor: "rgba(255,255,255,0.06)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <View style={{ height: 240, backgroundColor: "rgba(255,255,255,0.05)" }}>
              <Image
                source={visual.artwork}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            <View style={{ padding: spacing.lg }}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.12)",
                  }}
                >
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 11,
                      fontWeight: "900",
                      letterSpacing: 1,
                    }}
                  >
                    {getKindLabel(program.kind)}
                  </Text>
                </View>

                {isLiveNow && (
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                      backgroundColor: "rgba(239,68,68,0.16)",
                      borderWidth: 1,
                      borderColor: "rgba(239,68,68,0.24)",
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 11,
                        fontWeight: "900",
                        letterSpacing: 1,
                      }}
                    >
                      EN VIVO
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={{
                  marginTop: 14,
                  color: "#FFFFFF",
                  fontSize: 26,
                  fontWeight: "900",
                  letterSpacing: -0.5,
                }}
              >
                {program.title}
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  color: "#9CC3FF",
                  fontSize: 14,
                  fontWeight: "900",
                }}
              >
                {scheduleLine}
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  color: "rgba(255,255,255,0.74)",
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                {program.host ?? "miDes Radio"}
              </Text>

              <Text
                style={{
                  marginTop: 16,
                  color: "rgba(255,255,255,0.84)",
                  fontSize: 14,
                  lineHeight: 22,
                }}
              >
                {program.description}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 22, gap: 12 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={isLiveNow ? handleGoToRadio : handleScheduleProgram}
                disabled={isSchedulingReminder}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: pressed ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.12)",
                  opacity: isSchedulingReminder ? 0.7 : 1,
                })}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>
                  {isLiveNow
                    ? "Escuchar ahora"
                    : isReminderScheduled
                    ? "Recordatorio activado"
                    : "Recordarme"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => console.log("Compartir programa", program)}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: pressed ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.12)",
                })}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>
                  Compartir
                </Text>
              </Pressable>
            </View>

            {!isLiveNow && nextEmission && (
              <View style={{ marginTop: 10 }}>
                {startsInLabel && (
                  <Text
                    style={{
                      color: "#9CC3FF",
                      fontSize: 13,
                      fontWeight: "900",
                    }}
                  >
                    {startsInLabel}
                  </Text>
                )}

                <Text
                  style={{
                    marginTop: 4,
                    color: "rgba(255,255,255,0.62)",
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  Próxima emisión: {program.dayLabel} • {program.start}
                </Text>
              </View>
            )}

            {canShowEpisodes && (
              <Pressable
                onPress={() =>
                  navigation.navigate("Episodes", {
                    programId: program.id,
                    title: program.title,
                  })
                }
                style={({ pressed }) => ({
                  paddingVertical: 14,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(156,195,255,0.08)",
                  borderWidth: 1,
                  borderColor: "rgba(156,195,255,0.18)",
                  opacity: pressed ? 0.92 : 1,
                })}
              >
                <Text style={{ color: "#9CC3FF", fontWeight: "900" }}>
                  Ver episodios
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}