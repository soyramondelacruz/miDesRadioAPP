// src/screens/ProgramDetailScreen.tsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { spacing } from "../theme";
import { getProgramVisuals } from "../data/programVisuals";
import { resolveProgramById } from "../utils/programs";

type RouteParams = {
  programId: string;
};

function getKindLabel(kind?: "music" | "show") {
  return kind === "music" ? "Música" : "Programa";
}

export function ProgramDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const { programId } = (route.params ?? {}) as RouteParams;

  const program = useMemo(() => {
    if (!programId) return null;
    return resolveProgramById(programId);
  }, [programId]);

  const visual = useMemo(() => {
    return getProgramVisuals(program as any);
  }, [program]);

  const canShowEpisodes = program?.kind === "show";

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

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xl }}>
          <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "900", textAlign: "center" }}>
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
        {/* Header premium */}
        <LinearGradient
          colors={["#0B1220", "#1E4F93", "#1F5FAE", "#163A6B", "#0E1624"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1.2 }}
          style={{
            paddingTop: insets.top + 8,
            paddingHorizontal: spacing.lg,
            paddingBottom: 28,
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

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
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

            <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 16 }}>
              Detalle del programa
            </Text>

            <View style={{ width: 42 }} />
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: -10 }}>
          {/* Hero card */}
          <View
            style={{
              borderRadius: 22,
              overflow: "hidden",
              backgroundColor: "rgba(255,255,255,0.06)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <View style={{ height: 220, backgroundColor: "rgba(255,255,255,0.05)" }}>
              <Image
                source={visual.artwork}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            <View style={{ padding: spacing.lg }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
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

                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: "rgba(156,195,255,0.10)",
                    borderWidth: 1,
                    borderColor: "rgba(156,195,255,0.18)",
                  }}
                >
                  <Text
                    style={{
                      color: "#9CC3FF",
                      fontSize: 11,
                      fontWeight: "900",
                    }}
                  >
                    {program.start} – {program.end}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  marginTop: 14,
                  color: "#FFFFFF",
                  fontSize: 24,
                  fontWeight: "900",
                  letterSpacing: -0.4,
                }}
              >
                {program.title}
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                {program.host ?? "miDes Radio"}
              </Text>

              <Text
                style={{
                  marginTop: 16,
                  color: "rgba(255,255,255,0.82)",
                  fontSize: 14,
                  lineHeight: 22,
                }}
              >
                {program.description}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={{ marginTop: 18, gap: 12 }}>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "900",
              }}
            >
              Acciones
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
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
                <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>Compartir</Text>
              </Pressable>

              <Pressable
                onPress={() => console.log("Agendar programa", program)}
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
                <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>Agendar</Text>
              </Pressable>
            </View>

            {canShowEpisodes && (
              <Pressable
                onPress={() => console.log("Ver episodios", program)}
                style={({ pressed }) => ({
                  paddingVertical: 14,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: pressed ? "rgba(156,195,255,0.14)" : "rgba(156,195,255,0.10)",
                  borderWidth: 1,
                  borderColor: "rgba(156,195,255,0.18)",
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