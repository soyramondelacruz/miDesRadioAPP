import React from "react";
import { View, Text } from "react-native";
import { RADIO_CONFIG } from "../config/radio.config";
import { useRadioPlayer } from "../hooks/useRadioPlayer";
import { PlayerControls } from "../components/PlayerControls";
import { useNowPlaying } from "../hooks/useNowPlaying";
import { NowPlayingCard } from "../components/NowPlayingCard";
import { colors, spacing } from "../theme";

export function RadioScreen() {
  const { state, play, pause, stop } = useRadioPlayer();
  const now = useNowPlaying(30000);

  return (
    <View
      style={{
        flex: 1,
        padding: spacing.lg,
        gap: spacing.md,
        backgroundColor: colors.background,
      }}
    >
      <Text style={{ fontSize: 26, fontWeight: "800" }}>
        {RADIO_CONFIG.APP_NAME}
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: state.isLive ? colors.danger : colors.muted,
        }}
      >
        {state.isLive ? "🔴 En vivo" : "⚪️ Offline"}
      </Text>

      {state.status === "error" && (
        <Text style={{ color: colors.danger }}>
          Error: {state.errorMessage ?? "No se pudo reproducir."}
        </Text>
      )}

      <PlayerControls
        status={state.status}
        onPlay={play}
        onPause={pause}
        onStop={stop}
      />

      {now.loading && (
        <Text style={{ color: colors.muted }}>
          Cargando Ahora Sonando…
        </Text>
      )}

      {now.error && (
        <Text style={{ color: colors.danger }}>
          Error Ahora Sonando: {now.error}
        </Text>
      )}

      {now.data && (
        <NowPlayingCard data={now.data} variant="compact" />
      )}
    </View>
  );
}