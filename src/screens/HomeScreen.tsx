import React, { useEffect, useMemo, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { useRadioPlayer } from "../context/RadioPlayerContext";
import { VerseOfTheDay } from "../components/VerseOfTheDay";
import { spacing } from "../theme";

/** =========================
 * Helpers
 * ========================= */
function formatFechaCorta(d: Date) {
  try {
    return new Intl.DateTimeFormat("es-DO", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(d);
  } catch {
    return d.toDateString();
  }
}

/** =========================
 * Dark-ready Now Playing (Home)
 * ========================= */
function NowPlayingMini({
  title,
  host,
  isLive,
  onPress,
}: {
  title: string;
  host?: string | null;
  isLive?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.10)",
        opacity: pressed ? 0.95 : 1,
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "900",
              color: "rgba(255,255,255,0.75)",
              letterSpacing: 1,
            }}
          >
            AHORA SONANDO
          </Text>

          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              fontWeight: "900",
              color: "#FFFFFF",
              marginTop: 6,
            }}
          >
            {title}
          </Text>

          {!!host && (
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: "rgba(255,255,255,0.72)",
                marginTop: 4,
              }}
            >
              {host}
            </Text>
          )}
        </View>

        <View style={{ alignItems: "flex-end", gap: 8 }}>
          {isLive ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 99,
                  backgroundColor: "#FF4D4D",
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "900",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                LIVE
              </Text>
            </View>
          ) : (
            <Text
              style={{
                fontSize: 12,
                fontWeight: "900",
                color: "rgba(255,255,255,0.60)",
              }}
            >
              OFFLINE
            </Text>
          )}

          <Text style={{ fontSize: 12, fontWeight: "900", color: "#9CC3FF" }}>
            Abrir →
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { now, effectiveNow, status, play, pause } = useRadioPlayer();

  const metaFecha = useMemo(() => formatFechaCorta(effectiveNow), [effectiveNow]);

  const isLoading = status === "loading";
  const isPlaying = status === "playing";

  /** ✅ Halo / pulse animation */
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isPlaying) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 850,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 850,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [isPlaying, pulse]);

  function handleFabPress() {
    if (isLoading) return;
    if (isPlaying) pause();
    else play();
  }

  const npTitle =
    now.data?.show?.title ??
    now.data?.track?.title ??
    now.data?.station ??
    "miDes Radio";

  const npHost = now.data?.show?.host ?? now.data?.track?.artist ?? "—";
  const npIsLive = !!now.data?.isLive;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={{ flex: 1, backgroundColor: "#0E1624" }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER dentro del Scroll (para overlap del versículo) */}
          <LinearGradient
            colors={["#1E4E8A", "#234C86"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.md,
              paddingBottom: 63,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <View style={{ gap: 2 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "900",
                    color: "#fff",
                    letterSpacing: -0.3,
                  }}
                >
                  miDes Radio
                </Text>
                <Text style={{ fontSize: 12, opacity: 0.85, color: "#fff" }}>
                  Inspirando tu corazón cada día
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: 10,
                    opacity: 0.85,
                    color: "#fff",
                    fontWeight: "700",
                    letterSpacing: 1,
                  }}
                >
                  {metaFecha.toUpperCase()}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* CONTENIDO dark */}
          <View
            style={{
              paddingHorizontal: spacing.lg,
              paddingTop: 0,
              gap: spacing.md,
            }}
          >
            {/* Versículo flotante (overlap real) */}
            <View style={{ marginTop: -44, position: "relative", zIndex: 20 }}>
              <VerseOfTheDay compact />

              {/* FAB invadiendo el card del versículo */}
              <View
                style={{
                  position: "absolute",
                  right: 14,
                  bottom: -26,
                  zIndex: 60,
                  elevation: 60,
                }}
              >
                {/* Halo animado: MÁS visible */}
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

                      // borde + glow sutil
                      borderWidth: 2,
                      borderColor: "rgba(245, 158, 80, 0.65)",
                      backgroundColor: "rgba(245, 158, 80, 0.10)",

                      // detrás del botón
                      zIndex: 0,

                      transform: [
                        {
                          scale: pulse.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.98, 1.22],
                          }),
                        },
                      ],
                      opacity: pulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.55, 0.05],
                      }),
                    }}
                  />
                )}

                {/* Botón */}
                <Pressable
                  onPress={handleFabPress}
                  style={({ pressed }) => ({
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: "#FFFFFF",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: pressed ? 0.92 : 1,

                    borderWidth: 2,
                    borderColor: "#B2CEEE",

                    // iOS shadow
                    shadowColor: "#000",
                    shadowOpacity: 0.18,
                    shadowRadius: 18,
                    shadowOffset: { width: 0, height: 10 },

                    // Android
                    elevation: 16,

                    // arriba del halo
                    zIndex: 1,
                  })}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#184f92" />
                  ) : (
                    <Text
                      style={{
                        color: "#184f92",
                        fontSize: 24,
                        fontWeight: "900",
                        marginLeft: isPlaying ? 0 : 3,
                      }}
                    >
                      {isPlaying ? "❚❚" : "▶"}
                    </Text>
                  )}
                </Pressable>
              </View>

              {/* spacer para que el FAB no tape lo siguiente */}
              <View style={{ height: 22 }} />
            </View>

            {/* NowPlaying */}
            <View style={{ marginTop: 28 }}>
              <NowPlayingMini
                title={npTitle}
                host={npHost}
                isLive={npIsLive}
                onPress={() => navigation.navigate("Radio")}
              />
            </View>

            {/* Accesos rápidos */}
            <View style={{ gap: spacing.sm, marginTop: 2 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "900",
                  color: "rgba(255,255,255,0.70)",
                  letterSpacing: 1,
                }}
              >
                ACCESOS RÁPIDOS
              </Text>

              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <Pressable
                  onPress={() => navigation.navigate("Radio")}
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: spacing.md,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.10)",
                  }}
                >
                  <Text style={{ fontSize: 12, opacity: 0.8, fontWeight: "900", color: "#fff" }}>
                    ESCUCHAR
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: "900", marginTop: 6, color: "#fff" }}>
                    Radio en vivo
                  </Text>
                  <Text style={{ fontSize: 12, opacity: 0.75, marginTop: 4, color: "#fff" }}>
                    Alabanza • Oración • Reflexiones
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => navigation.navigate("Podcasts")}
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: spacing.md,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.10)",
                  }}
                >
                  <Text style={{ fontSize: 12, opacity: 0.8, fontWeight: "900", color: "#fff" }}>
                    CRECER
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: "900", marginTop: 6, color: "#fff" }}>
                    Podcasts
                  </Text>
                  <Text style={{ fontSize: 12, opacity: 0.75, marginTop: 4, color: "#fff" }}>
                    Mensajes y devocionales
                  </Text>
                </Pressable>
              </View>

              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <Pressable
                  onPress={() => navigation.navigate("Prayer")}
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: spacing.md,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.10)",
                  }}
                >
                  <Text style={{ fontSize: 12, opacity: 0.8, fontWeight: "900", color: "#fff" }}>
                    ORACIÓN
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: "900", marginTop: 6, color: "#fff" }}>
                    Pide oración
                  </Text>
                  <Text style={{ fontSize: 12, opacity: 0.75, marginTop: 4, color: "#fff" }}>
                    Comparte tu necesidad o testimonio
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => navigation.navigate("Give")}
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    padding: spacing.md,
                    overflow: "hidden",
                  }}
                >
                  <LinearGradient
                    colors={["#C56B22", "#B6561B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 16,
                      padding: spacing.md,
                      minHeight: 92,
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 12, opacity: 0.95, fontWeight: "900", color: "#fff" }}>
                      DONAR
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: "900", marginTop: 6, color: "#fff" }}>
                      Apoya
                    </Text>
                    <Text style={{ fontSize: 12, opacity: 0.95, marginTop: 4, color: "#fff" }}>
                      Ayuda a que esta misión crezca
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>

            {/* Footer */}
            <View
              style={{
                marginTop: spacing.lg,
                paddingTop: spacing.md,
                borderTopWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Text style={{ fontSize: 12, opacity: 0.75, color: "#fff" }}>
                miDes Radio • Jesús • Esperanza • Vida
              </Text>

              <TouchableOpacity onPress={() => navigation.navigate("Give")}>
                <Text style={{ fontSize: 13, fontWeight: "900", color: "#9CC3FF" }}>
                  Apoyar la misión →
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 12 }} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}