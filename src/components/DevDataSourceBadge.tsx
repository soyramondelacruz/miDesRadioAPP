import React from "react";
import { View, Text } from "react-native";
import type { DataSource } from "../types/remote.types";

type Props = {
  source: DataSource | null;
};

export function DevDataSourceBadge({ source }: Props) {
  if (!__DEV__) return null;
  if (!source) return null;

  const label =
    source === "remote" ? "DATA: REMOTE" : "DATA: LOCAL (fallback)";

  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        backgroundColor: "#fafafa",
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}