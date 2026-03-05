import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AppTabs } from "./AppTabs";
import { ProgramDetailScreen } from "../screens/ProgramDetailScreen";
import { PrayerScreen } from "../screens/PrayerScreen";

export type AppStackParamList = {
  Tabs: undefined;
  ProgramDetail: { programId: string };
  Prayer: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* Tabs principales */}
        <Stack.Screen name="Tabs" component={AppTabs} />

        {/* Detalle de programa */}
        <Stack.Screen
          name="ProgramDetail"
          component={ProgramDetailScreen}
          options={{ headerShown: true, title: "Programa" }}
        />

        {/* Pantalla de oración (fuera del TabBar) */}
        <Stack.Screen
          name="Prayer"
          component={PrayerScreen}
          options={{ headerShown: true, title: "Oración" }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}