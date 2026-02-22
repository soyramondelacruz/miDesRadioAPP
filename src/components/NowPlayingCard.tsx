// src/components/NowPlayingCard.tsx
import React, { useMemo } from "react";
import { View, Text } from "react-native";
import type { NowPlayingPayload } from "../types/content.types";
import { colors, spacing } from "../theme";

type Variant = "default" | "compact";

type Props = {
  data: NowPlayingPayload;
  variant?: Variant;
};

function safeText(v?: string | null) {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

export function NowPlayingCard({ data, variant = "default" }: Props) {
  const title = useMemo(() => {
    // Prefer show title, then track title, then station
    return (
      safeText(data.show?.title) ??
      safeText(data.track?.title) ??
      safeText(data.station) ??
      "miDes Radio"
    );
  }, [data]);

  const subtitle = useMemo(() => {
    // Prefer show host, then track artist
    const host = safeText(data.show?.host);
    const artist = safeText(data.track?.artist);

    if (host) return `con ${host}`;
    if (artist) return artist;

    return "En vivo";
  }, [data]);

  const isLive = !!data.isLive;

  if (variant === "compact") {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          padding: spacing.md,
        }}
      >
        {/* Icon bubble */}
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor: "rgba(24,79,146,0.10)",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              borderWidth: 2,
              borderColor: "rgba(24,79,146,0.55)",
            }}
          />
        </View>

        {/* Text */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: "#0E1624",
            }}
          >
            {title}
          </Text>

          <Text
            numberOfLines={1}
            style={{
              marginTop: 2,
              fontSize: 12,
              opacity: 0.72,
              color: "#0E1624",
              fontWeight: "600",
            }}
          >
            {subtitle}
          </Text>
        </View>

        {/* Live badge */}
        <View style={{ alignItems: "flex-end", gap: 6 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: isLive ? "#EF4444" : "rgba(0,0,0,0.25)",
              }}
            />
            <Text
              style={{
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 1,
                color: isLive ? "#EF4444" : "rgba(0,0,0,0.45)",
              }}
            >
              {isLive ? "LIVE" : "OFFLINE"}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // default variant (si lo usas en otra pantalla)
  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: 18,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
        gap: 8,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: "900", opacity: 0.6 }}>
        AHORA SONANDO
      </Text>

      <Text style={{ fontSize: 18, fontWeight: "900", color: "#0E1624" }}>
        {title}
      </Text>

      <Text style={{ fontSize: 13, opacity: 0.75, fontWeight: "600" }}>
        {subtitle}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: isLive ? "#EF4444" : "rgba(0,0,0,0.25)",
          }}
        />
        <Text
          style={{
            fontSize: 10,
            fontWeight: "900",
            letterSpacing: 1,
            color: isLive ? "#EF4444" : "rgba(0,0,0,0.45)",
          }}
        >
          {isLive ? "EN VIVO" : "OFFLINE"}
        </Text>
      </View>
    </View>
  );
}