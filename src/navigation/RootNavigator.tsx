import React from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";

import { AppTabs } from "./AppTabs";
import { MiniPlayer } from "../components/MiniPlayer";
import { ProgramDetailScreen } from "../screens/ProgramDetailScreen";
import { PrayerScreen } from "../screens/PrayerScreen";

export type RootStackParamList = {
  Tabs: undefined;
  ProgramDetail: { programId: string };
  Prayer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function getActiveRouteName(state: any): string {
  const route = state.routes[state.index];
  if (route.state) return getActiveRouteName(route.state);
  return route.name;
}

export function RootNavigator({ theme }: any) {
  const navigationRef = useNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = React.useState("Radio");

  const isDark = theme?.background === "#0E1624";
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: theme?.primary ?? baseTheme.colors.primary,
      background: theme?.background ?? baseTheme.colors.background,
      card: theme?.surface ?? baseTheme.colors.card,
      text: theme?.text ?? baseTheme.colors.text,
      border: baseTheme.colors.border,
      notification: theme?.accent ?? baseTheme.colors.notification,
    },
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      onStateChange={() => {
        const state = navigationRef.getRootState();
        if (state) setCurrentRoute(getActiveRouteName(state));
      }}
    >
      <View style={{ flex: 1, backgroundColor: navigationTheme.colors.background }}>
        {/* STACK */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={AppTabs} />

          <Stack.Screen
            name="ProgramDetail"
            component={ProgramDetailScreen}
            options={{ headerShown: true, title: "Programa" }}
          />

          <Stack.Screen
            name="Prayer"
            component={PrayerScreen}
            options={{ headerShown: true, title: "Oración" }}
          />
        </Stack.Navigator>

        {/* MINI PLAYER (solo si NO estás en Radio) */}
        {currentRoute !== "Radio" && (
          <View
            pointerEvents="box-none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 70,
            }}
          >
            <MiniPlayer />
          </View>
        )}
      </View>
    </NavigationContainer>
  );
}