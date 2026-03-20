// src/components/MiniPlayer.tsx
import React from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
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

  function handleOpenRadio() {
    navigation.navigate("Radio");
  }

  const statusLabel = isPlaying ? "En vivo" : isPaused ? "Pausado" : "Listo";
  const statusColor = isPlaying ? "#EF4444" : "rgba(255,255,255,0.58)";

  return (
    <View
      pointerEvents="box-none"
      style={{
        paddingHorizontal: 14,
      }}
    >
      <Pressable
        onPress={handleOpenRadio}
        style={({ pressed }) => ({
          minHeight: 52,
          borderRadius: 18,
          overflow: "hidden",
          backgroundColor: "rgba(14,22,36,0.94)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
          opacity: pressed ? 0.96 : 1,

          shadowColor: "#000",
          shadowOpacity: 0.16,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 14,
        })}
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

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 8,
            gap: 12,
          }}
        >
          {/* Play / Pause */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              handleTogglePlayback();
            }}
            style={({ pressed }) => ({
              width: 34,
              height: 34,
              borderRadius: 17,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(47,93,159,0.18)",
              borderWidth: 1,
              borderColor: "rgba(47,93,159,0.28)",
              opacity: pressed ? 0.9 : 1,
            })}
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
          </Pressable>

          {/* Title */}
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: "700",
              color: "#FFFFFF",
              letterSpacing: -0.2,
            }}
          >
            miDes Radio
          </Text>

          {/* Status */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 99,
                backgroundColor: statusColor,
              }}
            />
            <Text
              style={{
                fontSize: 11,
                fontWeight: "600",
                color: "rgba(255,255,255,0.78)",
                textTransform: "uppercase",
                letterSpacing: 0.6,
              }}
            >
              {statusLabel}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}