import React from "react";
import { View, Button, Text } from "react-native";
import { PlayerStatus } from "../types/radio.types";
import { spacing, colors } from "../theme";

type Props = {
  status: PlayerStatus;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
};

export function PlayerControls({ status, onPlay, onPause, onStop }: Props) {
  const isIdle = status === "idle";
  const isLoading = status === "loading";
  const isPlaying = status === "playing";
  const isPaused = status === "paused";
  const isError = status === "error";

  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={{ fontSize: 13, color: colors.muted }}>
        Estado: {status}
      </Text>

      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <Button
          title={isLoading ? "Conectando…" : "▶️ Play"}
          onPress={onPlay}
          disabled={!(isIdle || isPaused || isError)}
        />

        <Button
          title="⏸ Pause"
          onPress={onPause}
          disabled={!isPlaying}
        />

        <Button
          title="⏹ Stop"
          onPress={onStop}
          disabled={!(isPlaying || isPaused)}
        />
      </View>
    </View>
  );
}