import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRadioPlayer } from "../context/RadioPlayerContext";
import { useNowPlaying } from "../hooks/useNowPlaying";
import { colors, spacing, radius, typography } from "../theme";

export function MiniPlayer() {
  const { status, play, pause, now } = useRadioPlayer();


  const isPlaying = status === "playing";

  if (status === "idle") return null;

  const title =
    now.data?.show?.title ??
    now.data?.track?.title ??
    "miDes Radio";

  return (
    <View
      style={{
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <TouchableOpacity
        onPress={isPlaying ? pause : play}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: typography.size.md,
            fontFamily: typography.fontFamily.bold,
          }}
        >
          {isPlaying ? "⏸" : "▶️"}
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: typography.size.sm,
            fontFamily: typography.fontFamily.bold,
            color: colors.textPrimary,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: typography.size.xs,
            fontFamily: typography.fontFamily.medium,
            color: isPlaying ? colors.danger : colors.textSecondary,
          }}
        >
          {isPlaying ? "🔴 En vivo" : "Offline"}
        </Text>
      </View>
    </View>
  );
}