// src/components/MiniPlayer.tsx
import React from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useRadioPlayer } from "../context/RadioPlayerContext";

export function MiniPlayer() {
  const navigation = useNavigation<any>();
  const { status, play, pause } = useRadioPlayer();

  const isLoading = status === "loading";
  const isPlaying = status === "playing";
  const isPaused = status === "paused";

  const pulse = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (!isPlaying) {
      pulse.stopAnimation();
      pulse.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.28,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [isPlaying, pulse]);

  function handleOpenRadio() {
    navigation.navigate("Radio");
  }

  async function handleTogglePlayback() {
    if (isLoading) return;

    try {
      if (isPlaying) {
        await pause();
      } else {
        await play();
      }
    } catch (error) {
      console.log("MiniPlayer toggle error:", error);
    }
  }

  const statusLabel = isPlaying ? "En vivo" : isPaused ? "Pausado" : "Listo";
  const statusColor = isPlaying ? "#EF4444" : "rgba(255,255,255,0.58)";

  return (
    <View
      style={{
        paddingHorizontal: 14,
      }}
    >
      <View
        style={{
          minHeight: 52,
          borderRadius: 18,
          overflow: "hidden",
          backgroundColor: "rgba(14,22,36,0.94)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
          shadowColor: "#000",
          shadowOpacity: 0.16,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 14,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        {isPlaying && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 2,
              backgroundColor: "rgba(47,93,159,0.95)",
            }}
          />
        )}

        {/* Play / Pause */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleTogglePlayback}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(47,93,159,0.18)",
            borderWidth: 1,
            borderColor: "rgba(47,93,159,0.28)",
            marginRight: 12,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#9CC3FF" />
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={18}
              color="#FFFFFF"
              style={{ marginLeft: isPlaying ? 0 : 2 }}
            />
          )}
        </TouchableOpacity>

        {/* Zona que abre Radio */}
        <Pressable
          onPress={handleOpenRadio}
          style={({ pressed }) => ({
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: pressed ? 0.97 : 1,
          })}
        >
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: "900",
              color: "#FFFFFF",
              letterSpacing: -0.2,
            }}
          >
            miDes Radio
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginLeft: 12,
            }}
          >
            <Animated.View
              style={{
                width: 7,
                height: 7,
                borderRadius: 99,
                backgroundColor: statusColor,
                opacity: pulse,
              }}
            />
            <Text
              style={{
                fontSize: 10,
                fontWeight: "700",
                color: "rgba(255,255,255,0.78)",
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              {statusLabel}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}