// src/components/UpcomingProgramsCarousel.tsx
import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Program } from "../data/schedule";
import { getProgramVisuals } from "../data/programVisuals";

type Props = {
  title?: string;
  programs: Program[];            // 👈 upcoming (ya filtrados en RadioScreen)
  currentProgram?: Program | null; // 👈 para resaltar si aparece o para mostrar "AHORA"
  onOpenProgramMenu?: (program: Program) => void;
};

function metaLabel(p: Program) {
  const time = `${p.start} – ${p.end}`;
  return p.host ? `${time} • ${p.host}` : time;
}

export function UpcomingProgramsCarousel({
  title = "Lo que viene",
  programs,
  currentProgram = null,
  onOpenProgramMenu,
}: Props) {
  // (Opcional) si quieres incluir el current arriba del carrusel, lo hacemos aquí.
  // Por ahora: resaltamos si el current aparece en la lista, y si no, solo mostramos upcoming.
  const list = useMemo(() => programs ?? [], [programs]);

  if (!list.length) {
    return (
      <View style={{ marginTop: 18 }}>
        <Text style={{ fontSize: 16, fontWeight: "900", color: "#FFFFFF" }}>{title}</Text>
        <Text style={{ marginTop: 8, color: "rgba(255,255,255,0.65)", fontWeight: "700" }}>
          Aún no hay programación cargada.
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
        contentContainerStyle={{ gap: 12, paddingBottom: 6, paddingRight: 6 }}
      >
        {list.map((p) => {
          const isCurrent = !!currentProgram && p.id === currentProgram.id;
          const { artwork } = getProgramVisuals(p);

          return (
            <View
              key={`${p.id}-${p.start}-${p.end}`}
              style={{
                width: 290,
                borderRadius: 18,
                overflow: "hidden",
                backgroundColor: isCurrent ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: isCurrent ? "rgba(245,158,80,0.55)" : "rgba(255,255,255,0.10)",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", padding: 14, gap: 12 }}>
                {/* Artwork */}
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 14,
                    overflow: "hidden",
                    backgroundColor: "rgba(156,195,255,0.12)",
                    borderWidth: 1,
                    borderColor: isCurrent ? "rgba(245,158,80,0.55)" : "rgba(156,195,255,0.18)",
                  }}
                >
                  <Image source={artwork} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                </View>

                {/* Text */}
                <View style={{ flex: 1, minWidth: 0 }}>
                  {/* Badge */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 999,
                        backgroundColor: isCurrent ? "rgba(245,158,80,0.20)" : "rgba(255,255,255,0.08)",
                        borderWidth: 1,
                        borderColor: isCurrent ? "rgba(245,158,80,0.40)" : "rgba(255,255,255,0.10)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "900",
                          letterSpacing: 1,
                          color: isCurrent ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.70)",
                        }}
                      >
                        {isCurrent ? "AHORA" : "PRÓXIMO"}
                      </Text>
                    </View>

                    {isCurrent ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <View
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 99,
                            backgroundColor: "#EF4444",
                          }}
                        />
                        <Text style={{ fontSize: 10, fontWeight: "900", color: "rgba(255,255,255,0.85)" }}>
                          LIVE
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <Text numberOfLines={1} style={{ marginTop: 8, fontSize: 16, fontWeight: "900", color: "#FFFFFF" }}>
                    {p.title}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      fontWeight: "800",
                      color: "rgba(255,255,255,0.72)",
                    }}
                  >
                    {metaLabel(p)}
                  </Text>
                </View>

                {/* 3 dots */}
                <Pressable
                  onPress={() => onOpenProgramMenu?.(p)}
                  style={({ pressed }) => ({
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: pressed ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
                    borderWidth: 1,
                    borderColor: isCurrent ? "rgba(245,158,80,0.40)" : "rgba(255,255,255,0.10)",
                  })}
                >
                  <Feather name="more-horizontal" size={18} color="rgba(255,255,255,0.85)" />
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}