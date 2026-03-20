import React, { useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setAudioModeAsync } from "expo-audio";
import { useColorScheme } from "react-native";
import * as Notifications from "expo-notifications";
import { NavigationContainerRef } from "@react-navigation/native";

import { RootNavigator } from "../navigation/RootNavigator";
import { RadioPlayerProvider } from "../context/RadioPlayerContext";
import { LightTheme, DarkTheme } from "../theme/colors";
import type { RootStackParamList } from "../navigation/RootNavigator";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? DarkTheme : LightTheme;

  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          staysActiveInBackground: true,
        });
      } catch (error) {
        console.log("Audio mode error:", error);
      }
    };

    configureAudio();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as {
        screen?: string;
        programId?: string;
      };

      if (data?.screen === "ProgramDetail" && data?.programId) {
        navigationRef.current?.navigate("ProgramDetail", {
          programId: data.programId,
        });
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <RadioPlayerProvider>
        <RootNavigator ref={navigationRef} theme={theme} />
      </RadioPlayerProvider>
    </SafeAreaProvider>
  );
}