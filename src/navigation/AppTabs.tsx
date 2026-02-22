import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { HomeScreen } from "../screens/HomeScreen";
import { RadioScreen } from "../screens/RadioScreen";
import { PodcastsScreen } from "../screens/PodcastsScreen";
import { PrayerScreen } from "../screens/PrayerScreen";
import { DonationScreen } from "../screens/DonationScreen";

import { PremiumTabBar } from "./PremiumTabBar";

const Tab = createBottomTabNavigator();

export function AppTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <PremiumTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "Inicio" }} />
      <Tab.Screen name="Podcasts" component={PodcastsScreen} options={{ tabBarLabel: "Podcasts" }} />
      <Tab.Screen name="Radio" component={RadioScreen} options={{ tabBarLabel: "Radio" }} />
      <Tab.Screen name="Prayer" component={PrayerScreen} options={{ tabBarLabel: "Oración" }} />
      <Tab.Screen name="Give" component={DonationScreen} options={{ tabBarLabel: "Donar" }} />
    </Tab.Navigator>
  );
}