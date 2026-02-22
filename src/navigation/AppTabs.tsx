import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { HomeScreen } from "../screens/HomeScreen";
import { RadioScreen } from "../screens/RadioScreen";
import { PodcastsScreen } from "../screens/PodcastsScreen";
import { EventsScreen } from "../screens/EventsScreen";
import { DonationScreen } from "../screens/DonationScreen";

const Tab = createBottomTabNavigator();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#2F5D9F",
        tabBarInactiveTintColor: "#8E9AAF",
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Radio":
              iconName = "radio";
              break;
            case "Podcasts":
              iconName = "mic";
              break;
            case "Events":
              iconName = "calendar";
              break;
            case "Give":
              iconName = "heart";
              break;
          }

          return <Feather name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Radio" component={RadioScreen} />
      <Tab.Screen name="Podcasts" component={PodcastsScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Give" component={DonationScreen} />
    </Tab.Navigator>
  );
}