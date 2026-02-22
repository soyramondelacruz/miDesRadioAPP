import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { RadioScreen } from "../screens/RadioScreen";
import { ScheduleScreen } from "../screens/ScheduleScreen";
import { ContactScreen } from "../screens/ContactScreen";
import { AboutScreen } from "../screens/AboutScreen";

const Tab = createBottomTabNavigator();

export function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Radio" component={RadioScreen} />
      <Tab.Screen name="Programación" component={ScheduleScreen} />
      <Tab.Screen name="Contacto" component={ContactScreen} />
      <Tab.Screen name="Info" component={AboutScreen} />
    </Tab.Navigator>
  );
}