import React from "react";
import { ScrollView } from "react-native";
import { useRadioPlayer } from "../context/RadioPlayerContext";
import { PlayerControls } from "../components/PlayerControls";
import { NowPlayingCard } from "../components/NowPlayingCard";
import { spacing } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import { ScheduleSection } from "../components/ScheduleSection";
import { DebugTimePanel } from "../components/DebugTimePanel";
import { VerseOfTheDay } from "../components/VerseOfTheDay";

export function RadioScreen() {
  const { status, play, pause, now } = useRadioPlayer();

  return (
    <LinearGradient
      colors={["#B2CEEE", "#FAF8FA"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.lg,
          gap: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        <PlayerControls status={status} onPlay={play} onPause={pause} />

        {now.data ? <NowPlayingCard data={now.data} variant="compact" /> : null}

        <VerseOfTheDay compact />

        <ScheduleSection />

        <DebugTimePanel />
      </ScrollView>
    </LinearGradient>
  );
}