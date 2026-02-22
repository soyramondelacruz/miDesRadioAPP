import { View, Text, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { colors, spacing } from "../theme";

interface Props {
  data: {
    title: string;
    host?: string;
    isLive?: boolean;
  };
}

export function NowPlayingCard({ data }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.2,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.97)", "rgba(240,245,255,0.92)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 24,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 5,
      }}
    >
      {/* Icono circular */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.primary + "18",
          alignItems: "center",
          justifyContent: "center",
          marginRight: spacing.md,
        }}
      >
        <Feather name="radio" size={20} color={colors.primary} />
      </View>

      {/* Texto */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#1f2c4c",
          }}
          numberOfLines={1}
        >
          {data.title}
        </Text>

        {data.host && (
          <Text
            style={{
              marginTop: 2,
              fontSize: 13,
              color: "#6b7280",
            }}
            numberOfLines={1}
          >
            con {data.host}
          </Text>
        )}
      </View>

      {/* LIVE Indicator a la derecha */}
      {data.isLive && (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: spacing.sm,
        }}
      >
        <Animated.View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#ff3b30",
            transform: [{ scale: pulse }],
            marginRight: 5,
          }}
        />
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: "#ff3b30",
            letterSpacing: 1,
          }}
        >
          LIVE
        </Text>
      </View>
      )}
    </LinearGradient>
  );
}