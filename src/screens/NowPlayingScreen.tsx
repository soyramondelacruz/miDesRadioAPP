import React from "react";
import { View, Text, Button } from "react-native";
import { useNowPlaying } from "../hooks/useNowPlaying";
import { NowPlayingCard } from "../components/NowPlayingCard";

export function NowPlayingScreen() {
  const { data, loading, error, reload } = useNowPlaying(30000);

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "800" }}>Ahora Sonando</Text>

      {loading ? <Text>Cargando…</Text> : null}

      {error ? (
        <View style={{ gap: 8 }}>
          <Text style={{ color: "red" }}>Error: {error}</Text>
          <Button title="Reintentar" onPress={reload} />
        </View>
      ) : null}

      {data ? <NowPlayingCard data={data} variant="full" /> : null}
    </View>
  );
}