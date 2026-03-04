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
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
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
            color: "#ffffff",
          }}
        >
          miDes Radio
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 14,
            fontWeight: "600",
            color: isPlaying || isLoading ? "#9CC3FF" : "rgba(255,255,255,0.60)",
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
            color: "rgba(255,255,255,0.68)",

          }}
        >
          Inspirando tu corazón cada día
        </Text>
      </View>
    </View>
  );
}