import React, { useMemo } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { useRadioPlayer } from "../context/RadioPlayerContext";
import { VerseOfTheDay } from "../components/VerseOfTheDay";
import { spacing } from "../theme";
import { DAILY_PHRASES } from "../data/dailyPhrases";

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

function formatHora(d: Date) {
  try {
    return new Intl.DateTimeFormat("es-DO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  } catch {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }
}

function getDayOfYear(d: Date) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
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
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{ fontSize: 12, fontWeight: "900", color: "rgba(255,255,255,0.75)", letterSpacing: 1 }}>
            AHORA SONANDO
          </Text>

          <Text
            numberOfLines={1}
            style={{ fontSize: 16, fontWeight: "900", color: "#FFFFFF", marginTop: 6 }}
          >
            {title}
          </Text>

          {!!host && (
            <Text
              numberOfLines={1}
              style={{ fontSize: 12, fontWeight: "700", color: "rgba(255,255,255,0.72)", marginTop: 4 }}
            >
              {host}
            </Text>
          )}
        </View>

        <View style={{ alignItems: "flex-end", gap: 8 }}>
          {isLive ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 6, height: 6, borderRadius: 99, backgroundColor: "#FF4D4D" }} />
              <Text style={{ fontSize: 12, fontWeight: "900", color: "rgba(255,255,255,0.85)" }}>
                LIVE
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 12, fontWeight: "900", color: "rgba(255,255,255,0.60)" }}>
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
  const metaHora = useMemo(() => formatHora(effectiveNow), [effectiveNow]);

  const phrase = useMemo(() => {
    const idx = getDayOfYear(effectiveNow) % DAILY_PHRASES.length;
    return DAILY_PHRASES[idx];
  }, [effectiveNow]);

  const isLoading = status === "loading";
  const isPlaying = status === "playing";

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

  const npHost =
    now.data?.show?.host ??
    now.data?.track?.artist ??
    "—";

  const npIsLive = !!now.data?.isLive;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={{ flex: 1, backgroundColor: "#0E1624" }}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER dentro del Scroll: clave para que el versículo “flote” */}
          <LinearGradient
            colors={["#1E4E8A", "#234C86"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.md,
              paddingBottom: 66, // deja “hueco” para el overlap del versículo
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
                    fontSize: 22,
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
                <Text style={{ fontSize: 12, opacity: 0.85, color: "#fff" }}>
                  {metaFecha}
                </Text>
                <Text style={{ fontSize: 12, opacity: 0.85, color: "#fff" }}>
                  {metaHora}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 12, gap: 4 }}>
              <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.92)" }}>
                {phrase.text}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.70)",
                  fontWeight: "800",
                  letterSpacing: 1,
                }}
              >
                {phrase.category.toUpperCase()}
              </Text>
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
            {/* Versículo flotante (real overlap) */}
            <View style={{ marginTop: -44, position: "relative", zIndex: 20 }}>
              <VerseOfTheDay compact />

              {/* FAB Play/Pause flotante invadiendo el versículo */}
              <View
                style={{
                  position: "absolute",
                  right: 14,
                  bottom: -26,
                  zIndex: 50,
                  elevation: 50,
                }}
              >
                <Pressable
                  onPress={handleFabPress}
                  style={({ pressed }) => ({
                    width: 62,
                    height: 62,
                    borderRadius: 31,
                    overflow: "hidden",
                    opacity: pressed ? 0.92 : 1,
                    shadowColor: "#000",
                    shadowOpacity: 0.22,
                    shadowRadius: 18,
                    shadowOffset: { width: 0, height: 10 },
                    elevation: 14,
                  })}
                >
                  <LinearGradient
                    colors={["#184f92", "#38455c"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 22,
                          fontWeight: "900",
                          marginLeft: isPlaying ? 0 : 2,
                        }}
                      >
                        {isPlaying ? "❚❚" : "▶"}
                      </Text>
                    )}
                  </LinearGradient>
                </Pressable>
              </View>

              {/* spacer para que el FAB no tape lo siguiente */}
              <View style={{ height: 22 }} />
            </View>

            {/* NowPlaying visible SIEMPRE (dark-ready) */}
            <NowPlayingMini
              title={npTitle}
              host={npHost}
              isLive={npIsLive}
              onPress={() => navigation.navigate("Radio")}
            />

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

            {/* bottom spacing para no pegar con tabbar */}
            <View style={{ height: 12 }} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}