import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator, Animated, Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PlayerStatus } from "../types/radio.types";
import { spacing, colors } from "../theme";
import { useEffect, useRef } from "react";

type Props = {
  status: PlayerStatus;
  onPlay: () => void;
  onPause: () => void;
};

export function PlayerControls({ status, onPlay, onPause }: Props) {
  const isPlaying = status === "playing";
  const isLoading = status === "loading";

  const statusText = isLoading
    ? "Conectando..."
    : isPlaying
    ? "En vivo ahora"
    : "Offline";

    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      if (isPlaying) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.06,
              duration: 1400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 1400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        scaleAnim.setValue(1);
      }
    }, [isPlaying]);
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 25,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,
        marginBottom: spacing.lg,
      }}
    >
      {/* Botón Play */}
      <Animated.View
  style={{
    transform: [{ scale: scaleAnim }],
    marginRight: spacing.lg,
  }}
>
  <TouchableOpacity
    onPress={isPlaying ? onPause : onPlay}
    activeOpacity={0.85}
  >
    <LinearGradient
      colors={["#184F92", "#38455C"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text
          style={{
            fontSize: 24,
            color: "#FFFFFF",
            fontWeight: "700",
          }}
        >
          {isPlaying ? "❚❚" : "▶"}
        </Text>
      )}
    </LinearGradient>
  </TouchableOpacity>
</Animated.View>

      {/* Información */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "800",
            color: colors.textPrimary,
          }}
        >
          miDes Radio
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 14,
            fontWeight: "600",
            color: isPlaying || isLoading ? colors.accent : colors.textSecondary,
            opacity: isPlaying ? 1 : 0.7,
            letterSpacing: 0.3,
          }}
        >
          {statusText}
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 13,
            color: colors.textSecondary,

          }}
        >
          Inspirando tu corazón cada día
        </Text>
      </View>
    </View>
  );
}