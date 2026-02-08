import React from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Button,
} from "react-native";

import { useNowPlaying } from "../hooks/useNowPlaying";
import { useRadioPlayer } from "../hooks/useRadioPlayer";

import { NowPlayingCard } from "../components/NowPlayingCard";
import { PlayerControls } from "../components/PlayerControls";
import { DevDataSourceBadge } from "../components/DevDataSourceBadge";

export function NowPlayingScreen() {
  const {
    data,
    loading,
    refreshing,
    error,
    reload,
    refresh,
    source,
  } = useNowPlaying(30000);

  const { status, play, pause, stop } = useRadioPlayer();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingBottom: 32,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
    >
      <Text style={{ fontSize: 24, fontWeight: "800" }}>
        Ahora Sonando
      </Text>

      <DevDataSourceBadge source={source} />

      {loading ? <Text>Cargando…</Text> : null}

      {error ? (
        <View style={{ gap: 8 }}>
          <Text style={{ color: "red" }}>Error: {error}</Text>
          <Button title="Reintentar" onPress={reload} />
        </View>
      ) : null}

      {data ? <NowPlayingCard data={data} variant="full" /> : null}

      {/* Controles de audio */}
      <View style={{ marginTop: 8 }}>
        <PlayerControls
          status={status}
          onPlay={play}
          onPause={pause}
          onStop={stop}
        />
      </View>

      <Text style={{ opacity: 0.6 }}>
        Desliza hacia abajo para refrescar (ignora TTL).
      </Text>
    </ScrollView>
  );
}