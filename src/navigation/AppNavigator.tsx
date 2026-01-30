import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import { HomeScreen } from "../screens/HomeScreen";
import { NowPlayingScreen } from "../screens/NowPlayingScreen";
import { ScheduleScreen } from "../screens/ScheduleScreen";

export type RootTabsParamList = {
  Radio: undefined;
  Ahora: undefined;
  Programacion: undefined;
};

const Tab = createBottomTabNavigator<RootTabsParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerTitleAlign: "center" }}>
        <Tab.Screen name="Radio" component={HomeScreen} />
        <Tab.Screen name="Ahora" component={NowPlayingScreen} />
        <Tab.Screen name="Programacion" component={ScheduleScreen} options={{ title: "Programación" }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}