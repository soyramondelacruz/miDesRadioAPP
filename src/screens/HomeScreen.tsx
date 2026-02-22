import React, { useMemo } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import { useRadioPlayer } from "../context/RadioPlayerContext";
import { VerseOfTheDay } from "../components/VerseOfTheDay";
import { NowPlayingCard } from "../components/NowPlayingCard";
import { spacing } from "../theme";

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

export function HomeScreen() {
  const { now, effectiveNow, status, play, pause } = useRadioPlayer();
  const navigation = useNavigation<any>();

  const metaFecha = useMemo(() => formatFechaCorta(effectiveNow), [effectiveNow]);
  const metaHora = useMemo(() => formatHora(effectiveNow), [effectiveNow]);

  const isPlaying = status === "playing";
  const onPressPlay = async () => {
    if (isPlaying) await pause();
    else await play();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0E1624" }} edges={["top"]}>
      {/* Scroll único que contiene header + body */}
      <ScrollView
        style={{ flex: 1, backgroundColor: "#0E1624" }}
        contentContainerStyle={{
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER (dentro del scroll) */}
        <LinearGradient
          colors={["#184f92", "#163D6E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: 62, // deja espacio para el overlap
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
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

              {/* Play redondo debajo del título, a la izquierda del subtítulo */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                  gap: 10,
                }}
              >
                <Pressable
                  onPress={onPressPlay}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: "rgba(255,255,255,0.14)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.18)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather
                    name={isPlaying ? "pause" : "play"}
                    size={16}
                    color="#fff"
                  />
                </Pressable>

                <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
                  Inspirando tu corazón cada día
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-end", paddingTop: 2 }}>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                {metaFecha}
              </Text>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                {metaHora}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* CONTENEDOR DEL BODY */}
        <View
          style={{
            paddingHorizontal: spacing.lg,
            backgroundColor: "#0E1624",
          }}
        >
          {/* ✅ Card flotante: AHORA sí sube encima del header */}
          <View
            style={{
              marginTop: -34, // 👈 overlap REAL con el header
              zIndex: 20,
              elevation: 20,
            }}
          >
            <View
              style={{
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.96)",
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.08)",
                shadowColor: "#000",
                shadowOpacity: 0.16,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 12 },
                overflow: "hidden",
              }}
            >
              <VerseOfTheDay compact />
            </View>
          </View>

          {/* Espacio mínimo entre cards */}
          <View style={{ height: spacing.md }} />

          {/* Now Playing (legible sobre dark) */}
          {now.data ? (
            <View
              style={{
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.92)",
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.08)",
                shadowColor: "#000",
                shadowOpacity: 0.10,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 8 },
                elevation: 6,
                overflow: "hidden",
              }}
            >
              <NowPlayingCard data={now.data} variant="compact" />
            </View>
          ) : null}

          <View style={{ height: spacing.lg }} />

          {/* Accesos rápidos */}
          <View style={{ gap: spacing.sm }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "900",
                color: "rgba(255,255,255,0.55)",
                letterSpacing: 0.6,
              }}
            >
              ACCESOS RÁPIDOS
            </Text>

            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <Pressable
                onPress={() => navigation.navigate("Radio")}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.10)",
                  borderRadius: 16,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.10)",
                }}
              >
                <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: "900" }}>
                  ESCUCHAR
                </Text>
                <Text style={{ fontSize: 15, color: "#fff", fontWeight: "900", marginTop: 6 }}>
                  Radio en vivo
                </Text>
                <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.70)", marginTop: 4 }}>
                  Alabanza • Oración • Reflexiones
                </Text>
              </Pressable>

              <Pressable
                onPress={() => navigation.navigate("Podcasts")}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.10)",
                  borderRadius: 16,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.10)",
                }}
              >
                <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: "900" }}>
                  CRECER
                </Text>
                <Text style={{ fontSize: 15, color: "#fff", fontWeight: "900", marginTop: 6 }}>
                  Podcasts
                </Text>
                <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.70)", marginTop: 4 }}>
                  Mensajes y devocionales
                </Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <Pressable
                onPress={() => navigation.navigate("Prayer")}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.10)",
                  borderRadius: 16,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.10)",
                }}
              >
                <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: "900" }}>
                  ORACIÓN
                </Text>
                <Text style={{ fontSize: 15, color: "#fff", fontWeight: "900", marginTop: 6 }}>
                  Pide oración
                </Text>
                <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.70)", marginTop: 4 }}>
                  Comparte tu necesidad o testimonio
                </Text>
              </Pressable>

              <Pressable
                onPress={() => navigation.navigate("Give")}
                style={{
                  flex: 1,
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={["#e68637", "#b85a18"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    padding: spacing.md,
                    minHeight: 104,
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

          <View style={{ height: spacing.xl }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}