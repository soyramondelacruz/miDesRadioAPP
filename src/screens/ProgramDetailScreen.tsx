// src/screens/ProgramDetailScreen.tsx
import React, { useMemo } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

import { spacing } from "../theme";
import { weeklySchedule, Program } from "../data/schedule";
import { getProgramVisuals } from "../data/programVisuals";
import { programCatalogById } from "../data/programCatalog";

function findProgramById(programId: string): Program | null {
  for (const day of Object.values(weeklySchedule)) {
    for (const p of day ?? []) if (p.id === programId) return p;
  }
  return null;
}

function getAirtimes(programId: string) {
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const rows: Array<{ day: string; start: string; end: string }> = [];

  Object.entries(weeklySchedule).forEach(([dayIndexStr, list]) => {
    const dayIndex = Number(dayIndexStr);
    (list ?? []).forEach((p) => {
      if (p.id === programId) {
        rows.push({ day: dayNames[dayIndex] ?? "—", start: p.start, end: p.end });
      }
    });
  });

  return rows;
}

export function ProgramDetailScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const programId = route.params?.programId as string;

  const base = useMemo(() => findProgramById(programId), [programId]);
  const catalog = programCatalogById[programId];

  const title = catalog?.title ?? base?.title ?? "Programa";
  const subtitle = catalog?.subtitle ?? base?.host ?? "miDes Radio";
  const description =
    catalog?.description ??
    "Pronto agregaremos una descripción completa de este programa.";

  const { artwork } = getProgramVisuals({ id: programId } as any);
  const airtimes = useMemo(() => getAirtimes(programId), [programId]);

  const HEADER_TOP = Math.max(insets.top, 14);

  return (
    <View style={{ flex: 1, backgroundColor: "#0E1624" }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 26 }}>
        <LinearGradient
          colors={["#0B1220", "#1E4F93", "#1F5FAE", "#163A6B", "#0E1624"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1.25 }}
          style={{
            paddingTop: HEADER_TOP - 10,
            paddingHorizontal: spacing.lg,
            paddingBottom: 16,
            overflow: "hidden",
          }}
        >
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: "900", letterSpacing: 1 }}>
            PROGRAMA
          </Text>

          <Text style={{ color: "#fff", fontSize: 24, fontWeight: "900", marginTop: 8 }} numberOfLines={2}>
            {title}
          </Text>

          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: "800", marginTop: 6 }} numberOfLines={1}>
            {subtitle}
          </Text>
        </LinearGradient>

        <View style={{ paddingHorizontal: spacing.lg, paddingTop: 16, gap: 12 }}>
          {/* Artwork */}
          <View
            style={{
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: "rgba(255,255,255,0.06)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <Image source={artwork} style={{ width: "100%", height: 220 }} resizeMode="cover" />
          </View>

          {/* Actions */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              onPress={() => {}}
              style={({ pressed }) => ({
                flex: 1,
                borderRadius: 14,
                paddingVertical: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: pressed ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
                flexDirection: "row",
                gap: 8,
              })}
            >
              <Feather name="heart" size={16} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "900" }}>Me gusta</Text>
            </Pressable>

            <Pressable
              onPress={() => {}}
              style={({ pressed }) => ({
                flex: 1,
                borderRadius: 14,
                paddingVertical: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: pressed ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
                flexDirection: "row",
                gap: 8,
              })}
            >
              <Feather name="share-2" size={16} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "900" }}>Compartir</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => {}}
            style={({ pressed }) => ({
              borderRadius: 14,
              paddingVertical: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: pressed ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)",
              flexDirection: "row",
              gap: 8,
            })}
          >
            <Feather name="bell" size={16} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "900" }}>Recordarme cuando empiece</Text>
          </Pressable>

          {/* Description */}
          <View
            style={{
              borderRadius: 18,
              padding: 14,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <Text style={{ color: "rgba(255,255,255,0.80)", fontWeight: "900", letterSpacing: 0.6, marginBottom: 8 }}>
              Sobre este programa
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontWeight: "600", lineHeight: 18 }}>
              {description}
            </Text>
          </View>

          {/* Airtimes */}
          <View
            style={{
              borderRadius: 18,
              padding: 14,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <Text style={{ color: "rgba(255,255,255,0.80)", fontWeight: "900", letterSpacing: 0.6, marginBottom: 10 }}>
              Horario
            </Text>

            {airtimes.length ? (
              airtimes.map((r, idx) => (
                <View key={idx} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
                  <Text style={{ color: "#fff", fontWeight: "900" }}>{r.day}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.75)", fontWeight: "800" }}>
                    {r.start} – {r.end}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "rgba(255,255,255,0.65)", fontWeight: "700" }}>
                No hay horarios asociados todavía.
              </Text>
            )}
          </View>

          <View style={{ height: 18 }} />
        </View>
      </ScrollView>
    </View>
  );
}