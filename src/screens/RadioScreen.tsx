import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRadioPlayer } from "../context/RadioPlayerContext";
import { PlayerControls } from "../components/PlayerControls";
import { NowPlayingCard } from "../components/NowPlayingCard";
import { spacing } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import { ScheduleSection } from "../components/ScheduleSection";
import { DebugTimePanel } from "../components/DebugTimePanel";
import { VerseOfTheDay } from "../components/VerseOfTheDay";

export function RadioScreen() {
  const { status, play, pause, now, setDebugTime, appTime } =
    useRadioPlayer();

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          <PlayerControls
            status={status}
            onPlay={play}
            onPause={pause}
          />

          {now.data && (
            <NowPlayingCard
              data={{
                title:
                  now.data.show?.title ??
                  now.data.track?.title ??
                  now.data.station,
                host:
                  now.data.show?.host ??
                  now.data.track?.artist,
                isLive: now.data.isLive,
                mode: now.data.show ? "show" : "track",
              }}
            />
          )}

          <VerseOfTheDay compact />

          {/* Schedule ahora reacciona a appTime automáticamente */}
          <ScheduleSection currentTime={appTime} />

          {/* Debug conectado al motor global */}
          <DebugTimePanel
            currentTime={appTime}
            onApply={(date: Date) => setDebugTime(date)}
            onReset={() => setDebugTime(null)}
          />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}