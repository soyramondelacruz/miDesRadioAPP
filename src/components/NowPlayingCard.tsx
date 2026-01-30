import React from "react";
import { View, Text, Image } from "react-native";
import type { NowPlayingPayload } from "../types/content.types";

type Props = {
  data: NowPlayingPayload;
  variant?: "compact" | "full";
};

export function NowPlayingCard({ data, variant = "full" }: Props) {
  const showTitle = data.show?.title ?? "Sin programa";
  const host = data.show?.host;
  const timeRange =
    data.show?.startTime && data.show?.endTime
      ? `${data.show.startTime} – ${data.show.endTime}`
      : null;

  const trackLine = `${data.track?.title ?? "—"}${
    data.track?.artist ? ` • ${data.track.artist}` : ""
  }`;

  const imageUrl =
    variant === "compact"
      ? data.show?.coverImage ?? data.track?.artwork
      : data.show?.coverImage ?? data.track?.artwork;

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#e5e5e5",
        borderRadius: 16,
        padding: 14,
        gap: 10,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 16, fontWeight: "800" }}>Ahora Sonando</Text>
        <Text style={{ fontSize: 14 }}>
          {data.isLive ? "🔴 En vivo" : "⚪️ Offline"}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: variant === "compact" ? 56 : 84,
              height: variant === "compact" ? 56 : 84,
              borderRadius: 14,
              backgroundColor: "#f2f2f2",
            }}
          />
        ) : (
          <View
            style={{
              width: variant === "compact" ? 56 : 84,
              height: variant === "compact" ? 56 : 84,
              borderRadius: 14,
              backgroundColor: "#f2f2f2",
            }}
          />
        )}

        <View style={{ flex: 1, gap: 3 }}>
          <Text style={{ fontSize: 16, fontWeight: "800" }}>{showTitle}</Text>
          {host ? <Text style={{ opacity: 0.8 }}>Con: {host}</Text> : null}
          {timeRange ? <Text style={{ opacity: 0.7 }}>{timeRange}</Text> : null}

          <View style={{ height: 6 }} />

          <Text style={{ fontSize: 14, fontWeight: "700" }}>Tema</Text>
          <Text style={{ opacity: 0.85 }}>{trackLine}</Text>
        </View>
      </View>

      {variant === "full" ? (
        <>
          {data.show?.description ? (
            <Text style={{ opacity: 0.85 }}>{data.show.description}</Text>
          ) : null}

          <Text style={{ opacity: 0.6, marginTop: 2 }}>
            Actualizado: {data.updatedAt}
          </Text>
        </>
      ) : null}
    </View>
  );
}