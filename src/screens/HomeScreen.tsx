// src/screens/HomeScreen.tsx

import React, { useMemo } from "react";
import { ScrollView, Text, View, Pressable, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { useRadioPlayer } from "../context/RadioPlayerContext";
import { VerseOfTheDay } from "../components/VerseOfTheDay";
import { NowPlayingCard } from "../components/NowPlayingCard";
import { spacing } from "../theme";
import { DAILY_PHRASES } from "../data/dailyPhrases";

function getSaludoPorHora(hora: number) {
  if (hora < 12) return "Buenos días";
  if (hora < 18) return "Buenas tardes";
  return "Buenas noches";
}

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

// Day-of-year index (0..365)
function getDayOfYear(d: Date) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function HomeScreen() {
  const { now, effectiveNow } = useRadioPlayer();
  const navigation = useNavigation<any>();

  const saludo = useMemo(
    () => getSaludoPorHora(effectiveNow.getHours()),
    [effectiveNow]
  );

  const metaFecha = useMemo(() => formatFechaCorta(effectiveNow), [effectiveNow]);
  const metaHora = useMemo(() => formatHora(effectiveNow), [effectiveNow]);

  const phrase = useMemo(() => {
    const idx = getDayOfYear(effectiveNow) % DAILY_PHRASES.length;
    return DAILY_PHRASES[idx];
  }, [effectiveNow]);

  const hasNowPlaying = !!now.data;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <LinearGradient colors={["#B2CEEE", "#FAF8FA"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xl,
            gap: spacing.md,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER — Brand moment (curva + gradiente suave) */}
          <View style={{ marginHorizontal: -spacing.lg }}>
            <LinearGradient
              colors={["rgba(178,206,238,0.95)", "rgba(178,206,238,0.55)", "rgba(250,248,250,0.0)"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                paddingHorizontal: spacing.lg,
                paddingTop: spacing.md,
                paddingBottom: spacing.lg,
                borderBottomLeftRadius: 28,
                borderBottomRightRadius: 28,
              }}
            >
              <View style={{ gap: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: "900",
                      color: "#0E1624",
                      letterSpacing: -0.6,
                    }}
                  >
                    {saludo}
                  </Text>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 12, opacity: 0.68, color: "#0E1624" }}>
                      {metaFecha}
                    </Text>
                    <Text style={{ fontSize: 12, opacity: 0.68, color: "#0E1624" }}>
                      {metaHora}
                    </Text>
                  </View>
                </View>

                {/* Frase diaria (sin card) */}
                <View style={{ gap: 6 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 20,
                      color: "#38455c",
                      opacity: 0.92,
                    }}
                  >
                    {phrase.text}
                  </Text>

                  {/* Categoría debajo, pequeña */}
                  <Text
                    style={{
                      fontSize: 11,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                      color: "#184f92",
                      opacity: 0.9,
                      fontWeight: "800",
                    }}
                  >
                    {phrase.category}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Versículo del día (protagonista) */}
          <VerseOfTheDay compact />

          {/* Ahora Sonando (glass/compact, no compite) */}
          {hasNowPlaying ? (
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.60)",
                borderRadius: 18,
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >
              <NowPlayingCard data={now.data!} variant="compact" />
            </View>
          ) : null}

          {/* Accesos rápidos */}
          <View style={{ gap: spacing.sm }}>
            <Text style={{ fontSize: 12, fontWeight: "900", opacity: 0.55 }}>
              ACCESOS RÁPIDOS
            </Text>

            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <Pressable
                onPress={() => navigation.navigate("Radio")}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 16,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <Text style={{ fontSize: 12, opacity: 0.7, fontWeight: "900" }}>
                  ESCUCHAR
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "900", marginTop: 6, color: "#0E1624" }}>
                  Radio en vivo
                </Text>
                <Text style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                  Alabanza • Oración • Reflexiones
                </Text>
              </Pressable>

              <Pressable
                onPress={() => navigation.navigate("Podcasts")}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 16,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <Text style={{ fontSize: 12, opacity: 0.7, fontWeight: "900" }}>
                  CRECER
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "900", marginTop: 6, color: "#0E1624" }}>
                  Podcasts
                </Text>
                <Text style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                  Mensajes y devocionales
                </Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <Pressable
                onPress={() => navigation.navigate("Prayer")}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 16,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <Text style={{ fontSize: 12, opacity: 0.7, fontWeight: "900" }}>
                  CONECTAR
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "900", marginTop: 6, color: "#0E1624" }}>
                  Oración
                </Text>
                <Text style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                  Pide oración o comparte un testimonio
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
                  colors={["#184f92", "#38455c"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    padding: spacing.md,
                    minHeight: 92,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 12, opacity: 0.92, fontWeight: "900", color: "#fff" }}>
                    DONAR
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: "900", marginTop: 6, color: "#fff" }}>
                    Apoya
                  </Text>
                  <Text style={{ fontSize: 12, opacity: 0.92, marginTop: 4, color: "#fff" }}>
                    Ayuda a que esta misión crezca
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          {/* Footer sutil */}
          <View
            style={{
              marginTop: spacing.lg,
              paddingTop: spacing.md,
              borderTopWidth: 1,
              borderColor: "rgba(0,0,0,0.06)",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 12, opacity: 0.65 }}>
              miDes Radio • Jesús • Esperanza • Vida
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate("Give")}>
              <Text style={{ fontSize: 13, fontWeight: "900", color: "#184f92" }}>
                Apoyar la misión →
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}