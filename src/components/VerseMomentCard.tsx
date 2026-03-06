import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useVerseOfTheDay } from "../hooks/useVerseOfTheDay";

type Props = {
  onPress?: () => void; // opcional si luego abres pantalla de devocional
};

function clamp(s: string, max: number) {
  if (!s) return "";
  const t = s.trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

export function VerseMomentCard({ onPress }: Props) {
  const { verse } = useVerseOfTheDay();

  const ref = useMemo(() => verse?.ref ?? "Versículo del día", [verse]);
  const text = useMemo(() => verse?.text ?? "—", [verse]);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
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
      {/* Top row: label + share */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "900",
            letterSpacing: 0.5,
            color: "#9CC3FF",
          }}
        >
          Versículo de hoy
        </Text>

        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.08)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.10)",
          }}
        >
          <Feather name="share-2" size={15} color="rgba(255,255,255,0.80)" />
        </View>
      </View>

      {/* Verse text */}
      <Text
        numberOfLines={2}
        style={{
          marginTop: 10,
          fontSize: 13,
          fontWeight: "700",
          color: "rgba(255,255,255,0.92)",
          lineHeight: 18,
        }}
      >
        “{clamp(text, 86)}”
      </Text>

      {/* Reference */}
      <Text
        numberOfLines={1}
        style={{
          marginTop: 10,
          fontSize: 12,
          fontWeight: "900",
          color: "#9CC3FF",
        }}
      >
        {ref}
      </Text>
    </Pressable>
  );
}