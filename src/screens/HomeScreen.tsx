import React from "react";
import { View, Text } from "react-native";
import { RADIO_CONFIG } from "../config/radio.config";
import { useRadioPlayer } from "../hooks/useRadioPlayer";
import { PlayerControls } from "../components/PlayerControls";

export function HomeScreen() {
  const { state, play, pause, stop } = useRadioPlayer();

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", gap: 16 }}>
      <Text style={{ fontSize: 26, fontWeight: "800" }}>
        {RADIO_CONFIG.APP_NAME}
      </Text>

      <Text style={{ fontSize: 16 }}>
        {state.isLive ? "🔴 En vivo" : "⚪️ Offline"}
      </Text>

      {state.status === "error" && (
        <Text style={{ color: "red" }}>
          Error: {state.errorMessage ?? "No se pudo reproducir."}
        </Text>
      )}

      <PlayerControls status={state.status} onPlay={play} onPause={pause} onStop={stop} />
    </View>
  );
}