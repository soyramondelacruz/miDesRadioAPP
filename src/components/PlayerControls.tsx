import React from "react";
import { View, Button, Text } from "react-native";
import { PlayerStatus } from "../types/radio.types";

type Props = {
  status: PlayerStatus;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
};

export function PlayerControls({ status, onPlay, onPause, onStop }: Props) {
  const isLoading = status === "loading";
  const isPlaying = status === "playing";

  return (
    <View style={{ gap: 10 }}>
      <Text>Estado: {status}</Text>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <Button
          title={isLoading ? "Cargando..." : isPlaying ? "Reproduciendo" : "▶️ Play"}
          onPress={onPlay}
          disabled={isLoading || isPlaying}
        />
        <Button title="⏸ Pause" onPress={onPause} disabled={isLoading || !isPlaying} />
        <Button title="⏹ Stop" onPress={onStop} disabled={isLoading} />
      </View>
    </View>
  );
}