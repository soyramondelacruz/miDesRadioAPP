import React from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { View } from "react-native";

import { AppTabs } from "./AppTabs";
import { MiniPlayer } from "../components/MiniPlayer";

function getActiveRouteName(state: any): string {
  const route = state.routes[state.index];

  if (route.state) {
    return getActiveRouteName(route.state);
  }

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
        if (state) {
          const activeRoute = getActiveRouteName(state);
          setCurrentRoute(activeRoute);
        }
      }}
    >
      <View style={{ flex: 1, backgroundColor: navigationTheme.colors.background }}>
        <AppTabs />

        {currentRoute !== "Radio" && (
          <View
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