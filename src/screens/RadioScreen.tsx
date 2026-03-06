// src/screens/RadioScreen.tsx
import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Modal,
  Animated,
  Easing,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import { spacing } from "../theme";
import { useRadioPlayer } from "../context/RadioPlayerContext";
import { weeklySchedule, STATION_TIMEZONE } from "../data/schedule";
import { NowPlayingCard } from "../components/NowPlayingCard";
import { UpcomingProgramsCarousel } from "../components/UpcomingProgramsCarousel";
import { FeaturedProgramsGrid } from "../components/FeaturedProgramsGrid";
import { VerseMomentCard } from "../components/VerseMomentCard";

const { height: SCREEN_H } = Dimensions.get("window");

function safeText(v?: string | null) {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

/** =========================
 * Sliding Up Menu (Modal + Animated)
 * ========================= */
function SlidingSheet({
  visible,
  title,
  items,
  onClose,
}: {
  visible: boolean;
  title?: string;
  items: Array<{ label: string; icon?: keyof typeof Feather.glyphMap; onPress: () => void; tone?: "default" | "danger" }>;
  onClose: () => void;
}) {
  const translateY = useRef(new Animated.Value(60)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    translateY.setValue(60);
    backdrop.setValue(0);

    Animated.parallel([
      Animated.timing(backdrop, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, translateY, backdrop]);

  function close() {
    Animated.parallel([
      Animated.timing(backdrop, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(translateY, {
        toValue: 80,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
      <Pressable onPress={close} style={{ flex: 1 }}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.55)",
            opacity: backdrop,
            justifyContent: "flex-end",
          }}
        >
          <Pressable onPress={() => {}} style={{ paddingHorizontal: 16, paddingBottom: 18 }}>
            <Animated.View
              style={{
                transform: [{ translateY }],
                backgroundColor: "rgba(14,22,36,0.98)",
                borderRadius: 22,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
                overflow: "hidden",
              }}
            >
              <View style={{ alignItems: "center", paddingTop: 10, paddingBottom: 8 }}>
                <View
                  style={{
                    width: 44,
                    height: 5,
                    borderRadius: 99,
                    backgroundColor: "rgba(255,255,255,0.18)",
                  }}
                />
              </View>

              {!!title && (
                <Text
                  style={{
                    paddingHorizontal: 18,
                    paddingBottom: 8,
                    fontSize: 12,
                    fontWeight: "900",
                    letterSpacing: 1,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  {title}
                </Text>
              )}

              {items.map((it, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => {
                    close();
                    setTimeout(() => it.onPress(), 140);
                  }}
                  style={({ pressed }) => ({
                    paddingHorizontal: 18,
                    paddingVertical: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: pressed ? "rgba(255,255,255,0.06)" : "transparent",
                    borderTopWidth: idx === 0 ? 0 : 1,
                    borderTopColor: "rgba(255,255,255,0.08)",
                  })}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    {it.icon ? (
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 12,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(156,195,255,0.12)",
                          borderWidth: 1,
                          borderColor: "rgba(156,195,255,0.18)",
                        }}
                      >
                        <Feather name={it.icon} size={16} color="#9CC3FF" />
                      </View>
                    ) : null}

                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "800",
                        color: it.tone === "danger" ? "#FF6B6B" : "#FFFFFF",
                      }}
                    >
                      {it.label}
                    </Text>
                  </View>

                  <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.50)" />
                </Pressable>
              ))}

              <View style={{ height: 10 }} />
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

/** =========================
 * Program schedule helpers
 * ========================= */
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

  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { day: weekdayMap[weekdayStr], minutes: hour * 60 + minute };
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function isNowInProgram(nowMin: number, start: number, end: number) {
  if (end > start) return nowMin >= start && nowMin < end;
  return nowMin >= start || nowMin < end;
}

function getProgramProgress(nowMin: number, start: number, end: number) {
  let duration: number;
  let elapsed: number;

  if (end > start) {
    duration = end - start;
    elapsed = nowMin - start;
  } else {
    duration = 1440 - start + end;
    elapsed = nowMin >= start ? nowMin - start : 1440 - start + nowMin;
  }

  const p = elapsed / duration;
  return Math.max(0, Math.min(1, p));
}

function getRemainingMinutes(nowMin: number, start: number, end: number) {
  if (end > start) return Math.max(0, end - nowMin);
  if (nowMin >= start) return Math.max(0, 1440 - nowMin + end);
  return Math.max(0, end - nowMin);
}

function getCurrentAndUpcoming(day: number, minutes: number) {
  const today = weeklySchedule[day] || [];
  const upcoming: any[] = [];

  let current: any | null = null;

  for (let i = 0; i < today.length; i++) {
    const p = today[i];
    const s = timeToMinutes(p.start);
    const e = timeToMinutes(p.end);
    if (!current && isNowInProgram(minutes, s, e)) current = p;
  }

  for (let i = 0; i < today.length; i++) {
    const p = today[i];
    const s = timeToMinutes(p.start);
    if (minutes <= s) upcoming.push(p);
  }

  if (upcoming.length === 0) upcoming.push(...today.slice(0, 4));

  return { current, upcoming: upcoming.slice(0, 6) };
}

/** =========================
 * RadioScreen
 * ========================= */
export function RadioScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  // ✅ ahora todo usa el reloj del provider
  const { status, play, pause, effectiveNow } = useRadioPlayer();

  const isLoading = status === "loading";
  const isPlaying = status === "playing";

  const [mainSheetOpen, setMainSheetOpen] = useState(false);
  const [programSheetOpen, setProgramSheetOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

  const stationNow = useMemo(() => getStationNow(new Date(effectiveNow)), [effectiveNow]);

  const { current, upcoming } = useMemo(
    () => getCurrentAndUpcoming(stationNow.day, stationNow.minutes),
    [stationNow.day, stationNow.minutes]
  );

  const realProgress = useMemo(() => {
    if (!current) return 0;
    const start = timeToMinutes(current.start);
    const end = timeToMinutes(current.end);
    return getProgramProgress(stationNow.minutes, start, end);
  }, [current, stationNow.minutes]);

  const progressLabel = useMemo(() => {
    if (!current) return "Música continua";
    const start = timeToMinutes(current.start);
    const end = timeToMinutes(current.end);
    const remaining = getRemainingMinutes(stationNow.minutes, start, end);
    return remaining <= 1 ? "Finaliza ahora" : `Faltan ${remaining} min`;
  }, [current, stationNow.minutes]);

  function togglePlay() {
    if (isLoading) return;
    if (isPlaying) pause();
    else play();
  }

  /** Floating play pulse */
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isPlaying) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isPlaying, pulse]);

  const HEADER_TOP = Math.max(insets.top, 14);
  const HEADER_BOTTOM = 85;

  return (
    <View style={{ flex: 1, backgroundColor: "#0E1624" }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <LinearGradient
          colors={["#0B1220", "#1E4F93", "#1F5FAE", "#163A6B", "#0E1624"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1.25 }}
          style={{
            paddingTop: HEADER_TOP - 10,
            paddingHorizontal: spacing.lg,
            paddingBottom: HEADER_BOTTOM,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 12,
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

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginLeft: -25 }}>
              <Image
                source={require("../../assets/mides-radio-logo.png")}
                style={{
                  width: 160,
                  height: 56,
                  resizeMode: "contain",
                  marginTop: 12,
                  paddingLeft: 0,
                }}
              />
            </View>

            <Pressable
              onPress={() => setMainSheetOpen(true)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.10)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.14)",
                opacity: pressed ? 0.92 : 1,
              })}
            >
              <Feather name="chevron-down" size={16} color="rgba(255,255,255,0.90)" />
              <Text style={{ fontSize: 13, fontWeight: "900", color: "rgba(255,255,255,0.95)" }}>
                More
              </Text>
            </Pressable>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: spacing.lg }}>
          <View style={{ marginTop: -92, zIndex: 20 }}>
            <View
              style={{
                borderRadius: 22,
                shadowColor: "#000",
                shadowOpacity: 0.10,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 10 },
                elevation: 12,
              }}
            >
              <NowPlayingCard
                isPlaying={isPlaying}
                progress={realProgress}
                progressLabel={progressLabel}
              />

              <View style={{ position: "absolute", right: 18, bottom: -44 }}>
                {isPlaying && (
                  <Animated.View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      left: -14,
                      top: -14,
                      width: 92,
                      height: 92,
                      borderRadius: 46,
                      borderWidth: 2,
                      borderColor: "rgba(245,158,80,0.55)",
                      backgroundColor: "rgba(245,158,80,0.10)",
                      transform: [
                        {
                          scale: pulse.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.98, 1.18],
                          }),
                        },
                      ],
                      opacity: pulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.50, 0.06],
                      }),
                    }}
                  />
                )}

                <Pressable
                  onPress={togglePlay}
                  style={({ pressed }) => ({
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: "#FFFFFF",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: "rgba(178,206,238,0.85)",
                    opacity: pressed ? 0.9 : 1,
                    shadowColor: "#000",
                    shadowOpacity: 0.25,
                    shadowRadius: 20,
                    shadowOffset: { width: 0, height: 12 },
                    elevation: 16,
                  })}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#1F5FAE" />
                  ) : (
                    <Ionicons
                      name={isPlaying ? "pause" : "play"}
                      size={26}
                      color="#1F5FAE"
                      style={{ marginLeft: isPlaying ? 0 : 2 }}
                    />
                  )}
                </Pressable>
              </View>
            </View>

            <View
              style={{
                marginTop: 14,
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
              }}
            >
              <Pressable
                onPress={() => {}}
                style={({ pressed }) => ({
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: pressed ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.16)",
                })}
              >
                <Feather name="share-2" size={18} color="#FFFFFF" />
              </Pressable>

              <Pressable
                onPress={() => {}}
                style={({ pressed }) => ({
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: pressed ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.16)",
                })}
              >
                <Feather name="heart" size={18} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={{ height: 26 }} />
          </View>

          <UpcomingProgramsCarousel
            title="Lo que viene"
            programs={upcoming}
            currentProgram={current}
            onOpenProgramMenu={(p) => {
              setSelectedProgram(p);
              setProgramSheetOpen(true);
            }}
          />
         

          {/* ACCIONES RÁPIDAS */}
              <View style={{ marginTop: 18 }}>
                <Text style={{ fontSize: 16, fontWeight: "900", color: "#FFFFFF", marginBottom: 12 }}>
                  Acciones rápidas
                </Text>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Pressable
                    onPress={() => {
                      // aquí abres tu modal / navegas a Home donde esté oración
                      console.log("Pedir oración");
                    }}
                    style={({ pressed }) => ({
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 16,
                      alignItems: "center",
                      backgroundColor: pressed ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.14)",
                    })}
                  >
                    <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>Pedir oración</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => console.log("Compartir")}
                    style={({ pressed }) => ({
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 16,
                      alignItems: "center",
                      backgroundColor: pressed ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.14)",
                    })}
                  >
                    <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>Compartir</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => navigation.navigate("Give")}
                    style={({ pressed }) => ({
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 16,
                      alignItems: "center",
                      backgroundColor: pressed ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.14)",
                    })}
                  >
                    <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>Apoyar</Text>
                  </Pressable>
                </View>
              </View>

   

              {/* PROGRAMAS DESTACADOS (DINÁMICOS) */}
              <FeaturedProgramsGrid
                title="Programas destacados"
                count={6}
                mode="6h" // o "day"
                excludePrograms={[...(current ? [current] : []), ...upcoming]}
                fallbackFromSchedule={weeklySchedule[stationNow.day] ?? []}
              />

              {/* MOMENTOS */}
              <View style={{ marginTop: 18 }}>
                <Text style={{ fontSize: 16, fontWeight: "900", color: "#FFFFFF", marginBottom: 12 }}>
                  Momentos
                </Text>

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <VerseMomentCard onPress={() => { /* opcional: navegar a Devocional */ }} />

                  {/* Tu card de anuncio (deja el tuyo aquí) */}
                  <Pressable
                    onPress={() => {}}
                    style={({ pressed }) => ({
                      flex: 1,
                      borderRadius: 18,
                      overflow: "hidden",
                      backgroundColor: "rgba(255,255,255,0.06)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.10)",
                      padding: 14,
                      opacity: pressed ? 0.92 : 1,
                      transform: [{ scale: pressed ? 0.99 : 1 }],
                    })}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "900",
                        letterSpacing: 1.6,
                        color: "rgba(255,255,255,0.70)",
                      }}
                    >
                      ANUNCIOS
                    </Text>

                    <Text style={{ marginTop: 10, fontSize: 14, fontWeight: "900", color: "#FFFFFF" }} numberOfLines={2}>
                      Culto de Poder
                    </Text>

                    <Text style={{ marginTop: 6, fontSize: 12, fontWeight: "800", color: "rgba(255,255,255,0.72)" }}>
                      10:00 PM • Te esperamos
                    </Text>
                  </Pressable>
                </View>
              </View>

              <Text
              ></Text>
                      

          <SlidingSheet
            visible={mainSheetOpen}
            title="MI DES RADIO"
            onClose={() => setMainSheetOpen(false)}
            items={[
              { label: "Quiero Apoyar", icon: "heart", onPress: () => navigation.navigate("Give") },
              { label: "Compartir la app", icon: "share-2", onPress: () => console.log("Share app") },
              { label: "Ajustes", icon: "settings", onPress: () => console.log("Settings") },
            ]}
          />

          {/* PROGRAM MENU SHEET */}
            <SlidingSheet
              visible={programSheetOpen}
              title={selectedProgram ? selectedProgram.title : "PROGRAMA"}
              onClose={() => setProgramSheetOpen(false)}
              items={[
                { label: "Agendar", icon: "calendar", onPress: () => console.log("Schedule program", selectedProgram) },
                { label: "Compartir", icon: "share-2", onPress: () => console.log("Share program", selectedProgram) },

                // ✅ Solo mostrar “episodios / anteriores” si NO es música
                ...(selectedProgram?.kind === "show"
                  ? [
                      {
                        label: "Ver programas anteriores",
                        icon: "clock",
                        onPress: () => console.log("Past episodes", selectedProgram),
                      },
                    ]
                  : []),
              ]}
            />
        </View>
      </ScrollView>
    </View>
  );
}