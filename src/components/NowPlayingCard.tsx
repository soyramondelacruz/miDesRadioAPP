// src/components/NowPlayingCard.tsx
import React, { useMemo } from "react";
import { View, Text, Image } from "react-native";
import { spacing } from "../theme";

function safeText(v?: string | null) {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

type Props = {
  title?: string;
  subtitle?: string;
  isPlaying?: boolean;
  progress?: number; // 0..1
  progressLabel?: string;
};

export function NowPlayingCard({
  title = "miDes Radio",
  subtitle = "Tu emisora • 24/7",
  isPlaying = false,
  progress = 0,
  progressLabel = "En progreso",
}: Props) {
  const pct = useMemo(() => {
    const p = Number.isFinite(progress) ? progress : 0;
    return Math.max(0, Math.min(1, p));
  }, [progress]);

  const CARD_H = 160; // ✅ fija altura para que el artwork “cierre” perfecto

  return (
    <View
      style={{
        marginTop:25,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        overflow: "hidden",

        // ✅ Premium depth
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.55)",

        shadowColor: "#000",
        shadowOpacity: 0.16,
        shadowRadius: 26,
        shadowOffset: { width: 0, height: 14 },
        elevation: 14,
      }}
          >
      <View style={{ flexDirection: "row", height: CARD_H }}>
        {/* Artwork (altura fija = cero líneas blancas) */}
        <View
  style={{
    width: 128,
    height: CARD_H,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingLeft:12,
  }}
>
  <View
    style={{
      width: 118,
      height: 118,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    }}
  >
    <Image
      source={require("../../assets/artwork.jpg")}
      style={{
        width: "100%",
        height: "100%",
      }}
      resizeMode="cover"
    />
  </View>
</View>

        {/* Info */}
        <View style={{ 
          flex: 1, 
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.lg,
          }}>

          {/* LIVE/OFFLINE */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 6,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 99,
                backgroundColor: isPlaying ? "#EF4444" : "rgba(14,22,36,0.30)",
              }}
            />
            <Text
              style={{
                fontSize: 9,
                fontWeight: "700",
                letterSpacing: 0.3,
                color: isPlaying ? "#EF4444" : "rgba(14,22,36,0.45)",
              }}
            >
              {isPlaying ? "LIVE" : "OFFLINE"}
            </Text>
          </View>

          {/* Title / Subtitle */}
          <Text
            numberOfLines={1}
            style={{
              marginTop: 8,
              fontSize: 17,
              fontWeight: "900",
              color: "#0E1624",
              letterSpacing: -0.3,
            }}
          >
            {safeText(title) ?? "miDes Radio"}
          </Text>

          <Text
            numberOfLines={1}
            style={{
              marginTop: 4,
              fontSize: 12,
              fontWeight: "700",
              color: "rgba(14,22,36,0.70)",
            }}
          >
            {safeText(subtitle) ?? "En vivo"}
          </Text>

          {/* Progress */}
          <View style={{ marginTop: 12 }}>
            <View
              style={{
                height: 8,
                borderRadius: 999,
                backgroundColor: "rgba(31,95,174,0.14)",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${pct * 100}%`,
                  height: "100%",
                  backgroundColor: "#1F5FAE",
                }}
              />
            </View>

            <Text
              style={{
                marginTop: 6,
                fontSize: 11,
                fontWeight: "800",
                color: "rgba(14,22,36,0.55)",
              }}
            >
              {progressLabel}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}