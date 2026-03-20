// src/components/FeaturedProgramsGrid.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  Alert,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

import { spacing } from "../theme";
import { getProgramVisuals } from "../data/programVisuals";
import type { Program } from "../data/schedule";
import { getFeaturedProgramsDynamic } from "../utils/featuredPrograms";
import { useRadioPlayer } from "../context/RadioPlayerContext";

type Props = {
  title?: string;
  count?: number;
  excludePrograms?: Program[];
  fallbackFromSchedule?: Program[];
  mode?: "day" | "6h";
};

async function requestNotificationPermissions() {
  const settings = await Notifications.getPermissionsAsync();
  let finalStatus = settings.status;

  if (finalStatus !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    finalStatus = requested.status;
  }

  return finalStatus === "granted";
}

function ReminderClockButton({
  isScheduled,
  isScheduling,
  onPress,
}: {
  isScheduled: boolean;
  isScheduling: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isScheduled) return;

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.12,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isScheduled, scale]);

  return (
    <Pressable
      onPress={onPress}
      disabled={isScheduling}
      hitSlop={8}
      style={({ pressed }) => ({
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 20,
        width: 34,
        height: 34,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: pressed
          ? "rgba(255,255,255,0.16)"
          : isScheduled
          ? "rgba(156,195,255,0.18)"
          : "rgba(14,22,36,0.68)",
        borderWidth: 1,
        borderColor: isScheduled
          ? "rgba(156,195,255,0.30)"
          : "rgba(255,255,255,0.14)",
        opacity: isScheduling ? 0.7 : 1,
      })}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Feather
          name="clock"
          size={15}
          color={isScheduled ? "#9CC3FF" : "rgba(255,255,255,0.88)"}
        />
      </Animated.View>
    </Pressable>
  );
}

export function FeaturedProgramsGrid({
  title = "Programas destacados",
  count = 6,
  excludePrograms = [],
  fallbackFromSchedule = [],
  mode = "day",
}: Props) {
  const navigation = useNavigation<any>();
  const { effectiveNow } = useRadioPlayer();

  const [scheduledByProgramId, setScheduledByProgramId] = useState<Record<string, string>>({});
  const [schedulingProgramId, setSchedulingProgramId] = useState<string | null>(null);

  const excludeIds = useMemo(() => excludePrograms.map((p) => p.id), [excludePrograms]);

  const featured = useMemo(() => {
    return getFeaturedProgramsDynamic({
      count,
      effectiveNow,
      mode,
      excludeIds,
      fallbackFromSchedule,
    });
  }, [count, effectiveNow, mode, excludeIds, fallbackFromSchedule]);

  useEffect(() => {
    let mounted = true;

    async function loadScheduled() {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const map: Record<string, string> = {};

      for (const item of scheduled) {
        const pid = item.content.data?.programId;
        if (typeof pid === "string") {
          map[pid] = item.identifier;
        }
      }

      if (mounted) setScheduledByProgramId(map);
    }

    loadScheduled();

    return () => {
      mounted = false;
    };
  }, []);

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

        Alert.alert("Recordatorio eliminado", program.title);
        return;
      }

      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert("Permiso requerido", "Activa las notificaciones.");
        return;
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: program.title,
          body: `DEBUG: ${program.title}`,
          sound: true,
          data: {
            screen: "ProgramDetail",
            programId: program.id,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 10,
        },
      });

      setScheduledByProgramId((prev) => ({
        ...prev,
        [program.id]: identifier,
      }));

      Alert.alert("Recordatorio activado", program.title);
    } catch (error) {
      console.log("Featured schedule error:", error);
    } finally {
      setSchedulingProgramId(null);
    }
  }

  if (!featured.length) return null;

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

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {featured.map((p) => {
          const { artwork } = getProgramVisuals(p as any);
          const isScheduled = !!scheduledByProgramId[p.id];
          const isScheduling = schedulingProgramId === p.id;

          return (
            <View
              key={p.id}
              style={{
                width: "48%",
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
                <View style={{ height: 120, position: "relative" }}>
                  <Image
                    source={artwork}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />

                  <ReminderClockButton
                    isScheduled={isScheduled}
                    isScheduling={isScheduling}
                    onPress={() => handleScheduleProgram(p as any)}
                  />
                </View>

                <View style={{ padding: spacing.md }}>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 14, fontWeight: "900", color: "#FFF" }}
                  >
                    {p.title}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {p.subtitle ?? "miDes Radio"}
                  </Text>
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}