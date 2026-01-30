import React from "react";
import { View, Text, Button, ScrollView, RefreshControl } from "react-native";
import { useNowPlaying } from "../hooks/useNowPlaying";
import { NowPlayingCard } from "../components/NowPlayingCard";
import { DevDataSourceBadge } from "../components/DevDataSourceBadge";

export function NowPlayingScreen() {
  const { data, loading, refreshing, error, reload, refresh, source } = useNowPlaying(30000);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 24, gap: 12, paddingBottom: 24 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
    >
      <Text style={{ fontSize: 24, fontWeight: "800" }}>Ahora Sonando</Text>

      <DevDataSourceBadge source={source} />

      {loading ? <Text>Cargando…</Text> : null}

      {error ? (
        <View style={{ gap: 8 }}>
          <Text style={{ color: "red" }}>Error: {error}</Text>
          <Button title="Reintentar" onPress={reload} />
        </View>
      ) : null}

      {data ? <NowPlayingCard data={data} variant="full" /> : null}

      <Text style={{ opacity: 0.6 }}>
        Desliza hacia abajo para refrescar (ignora TTL).
      </Text>
    </ScrollView>
  );
}