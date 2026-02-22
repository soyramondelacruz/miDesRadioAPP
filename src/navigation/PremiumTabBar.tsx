import React from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

function getIcon(routeName: string, color: string, focused: boolean) {
  const size = routeName === "Radio" ? 20 : 20;

  switch (routeName) {
    case "Home":
      return <Feather name="home" size={size} color={color} />;

    case "Radio":
      // Feather NO tiene radio consistente en algunas builds; si te falla, cambia a MaterialCommunityIcons aquí
      return <Feather name="radio" size={size} color={color} />;

    case "Podcasts":
      return <Feather name="mic" size={size} color={color} />;

    case "Prayer":
      return (
        <MaterialCommunityIcons
          name="hands-pray"
          size={routeName === "Prayer" ? 22 : 20}
          color={color}
        />
      );

    case "Give":
      return <Feather name="heart" size={size} color={color} />;

    default:
      return null;
  }
}

export function PremiumTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const activeColor = "#2F5D9F";
          const inactiveColor = "#8E9AAF";
          const color = isFocused ? activeColor : inactiveColor;

          const isRadio = route.name === "Radio";

          if (isRadio) {
            return (
              <View key={route.key} style={styles.centerSlot}>
                <Pressable
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={({ pressed }) => [
                    styles.centerButton,
                    {
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                      backgroundColor: isFocused ? "#184f92" : "#2F5D9F",
                    },
                  ]}
                >
                  {getIcon(route.name, "#fff", isFocused)}
                </Pressable>

                <Text style={[styles.label, { color }]}>
                  {String(label)}
                </Text>
              </View>
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [
                styles.item,
                { opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View style={styles.iconWrap}>
                {getIcon(route.name, color, isFocused)}
                {isFocused ? <View style={styles.dot} /> : null}
              </View>

              <Text style={[styles.label, { color }]}>
                {String(label)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "transparent",
  },
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 18 : 12,
    paddingHorizontal: 10,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: -8 },
    elevation: 18,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 6,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    height: 26,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E68637",
    marginTop: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
  },

  // Centro (Radio)
  centerSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 2,
  },
  centerButton: {
    width: 46,
    height: 46,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,

    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
});