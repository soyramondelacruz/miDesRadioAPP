import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import { RadioScreen } from "../screens/RadioScreen";
import { NowPlayingScreen } from "../screens/NowPlayingScreen";
import { ScheduleScreen } from "../screens/ScheduleScreen";
import { ContactScreen } from "../screens/ContactScreen";

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
        <Tab.Screen name="Radio" component={RadioScreen} />
        <Tab.Screen name="Ahora" component={NowPlayingScreen} />
        <Tab.Screen name="Programacion" component={ScheduleScreen} options={{ title: "Programación" }} />
        <Tab.Screen name="Contacto" component={ContactScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}