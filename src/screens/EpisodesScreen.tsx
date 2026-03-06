import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { spacing } from "../theme";

type Episode = {
  id: string;
  title: string;
  date: string;
  duration: string;
};

const mockEpisodes: Episode[] = [
  {
    id: "ep1",
    title: "Cómo fortalecer tu vida de oración",
    date: "15 Mar 2026",
    duration: "28 min",
  },
  {
    id: "ep2",
    title: "La importancia del carácter cristiano",
    date: "12 Mar 2026",
    duration: "31 min",
  },
  {
    id: "ep3",
    title: "Dios en medio de la ansiedad",
    date: "08 Mar 2026",
    duration: "26 min",
  },
];

export function EpisodesScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { programId, title } = route.params ?? {};

  return (
    <View style={{ flex: 1, backgroundColor: "#0E1624", paddingTop: 40 }}>
      <View
        style={{
          paddingHorizontal: spacing.lg,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </Pressable>

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 18,
            fontWeight: "900",
            marginLeft: 16,
          }}
        >
          Episodios
        </Text>
      </View>

      <FlatList
        data={mockEpisodes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg }}
        renderItem={({ item }) => (
          <Pressable
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              padding: 16,
              borderRadius: 14,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: "800",
                fontSize: 15,
              }}
            >
              {item.title}
            </Text>

            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                marginTop: 6,
                fontSize: 13,
              }}
            >
              {item.date} • {item.duration}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}