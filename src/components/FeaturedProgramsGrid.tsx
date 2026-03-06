// src/components/FeaturedProgramsGrid.tsx
import React, { useMemo } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { spacing } from "../theme";
import { getProgramVisuals } from "../data/programVisuals";
import type { Program } from "../data/schedule";
import { getFeaturedProgramsDynamic } from "../utils/featuredPrograms";
import { useRadioPlayer } from "../context/RadioPlayerContext";

type Props = {
  title?: string;
  count?: number;

  /** excluye current + upcoming para no repetir */
  excludePrograms?: Program[];

  /** por si no hay catalog */
  fallbackFromSchedule?: Program[];

  /** Rotación estable */
  mode?: "day" | "6h";
};

export function FeaturedProgramsGrid({
  title = "Programas destacados",
  count = 6,
  excludePrograms = [],
  fallbackFromSchedule = [],
  mode = "day",
}: Props) {
  const navigation = useNavigation<any>();
  const { effectiveNow } = useRadioPlayer();

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

  if (!featured.length) return null;

  return (
    <View style={{ marginTop: 18 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "900",
          color: "#FFFFFF",
          marginBottom: 12,
          letterSpacing: -0.2,
        }}
      >
        {title}
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {featured.map((p) => {
          // getProgramVisuals infiere por title + id
          const { artwork } = getProgramVisuals(
            { id: p.id, title: p.title, host: p.subtitle, start: "00:00", end: "00:00" } as any
          );

          return (
            <Pressable
              key={p.id}
              onPress={() => navigation.navigate("ProgramDetail", { programId: p.id })}
              style={({ pressed }) => ({
                width: "48%",
                borderRadius: 18,
                overflow: "hidden",
                backgroundColor: pressed ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
              })}
            >
              <View style={{ height: 120, backgroundColor: "rgba(255,255,255,0.04)" }}>
                <Image source={artwork} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              </View>

              <View style={{ padding: spacing.md }}>
                <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: "900", color: "#FFFFFF" }}>
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
                  {p.subtitle ?? "miDes Radio"}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}