import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRadioPlayer } from "../context/RadioPlayerContext";
import { colors, spacing, radius, typography } from "../theme";

export function MiniPlayer() {
  const navigation = useNavigation<any>();
  const { status, play, pause, now } = useRadioPlayer();

  if (status === "idle") return null;

  const isPlaying = status === "playing";
  const isLoading = status === "loading";

  const title =
    now.data?.show?.title ??
    now.data?.track?.title ??
    "miDes Radio";

  const host =
    now.data?.show?.host ??
    now.data?.track?.artist ??
    null;

  function toggle() {
    if (isLoading) return;
    isPlaying ? pause() : play();
  }

  return (
    <Pressable
      onPress={() => navigation.navigate("Radio")}
      style={({ pressed }) => ({
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
        opacity: pressed ? 0.95 : 1,
      })}
    >
      {/* Play / Pause */}
      <Pressable
        onPress={toggle}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.primary,
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
              fontSize: typography.size.md,
              fontFamily: typography.fontFamily.bold,
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </Text>
        )}
      </Pressable>

      {/* Text */}
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
          numberOfLines={1}
          style={{
            fontSize: typography.size.xs,
            fontFamily: typography.fontFamily.medium,
            color: isPlaying
              ? colors.danger
              : isLoading
              ? colors.primary
              : colors.textSecondary,
          }}
        >
          {isLoading
            ? "Conectando..."
            : isPlaying
            ? host ?? "🔴 En vivo"
            : "Pausado"}
        </Text>
      </View>
    </Pressable>
  );
}