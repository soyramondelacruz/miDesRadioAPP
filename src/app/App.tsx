import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "../navigation/RootNavigator";
import { RadioPlayerProvider } from "../context/RadioPlayerContext";
import { setAudioModeAsync } from "expo-audio";
import { useColorScheme } from "react-native";
import { LightTheme, DarkTheme } from "../theme/colors";

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? DarkTheme : LightTheme;
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

  return (
    <SafeAreaProvider>
      <RadioPlayerProvider>
        <RootNavigator theme={theme} />
      </RadioPlayerProvider>
    </SafeAreaProvider>
  );
}