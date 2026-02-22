import React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useRadioPlayer } from "../context/RadioPlayerContext";
import { VerseOfTheDay } from "../components/VerseOfTheDay";
import { NowPlayingCard } from "../components/NowPlayingCard";
import { spacing } from "../theme";
import { LinearGradient } from "expo-linear-gradient";

export function HomeScreen() {
  const { now, appTime } = useRadioPlayer();
  const navigation = useNavigation<any>();

  function getGreeting() {
    const hour = appTime.getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#B2CEEE", "#FAF8FA"]}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            gap: spacing.lg,
            paddingBottom: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={{ fontSize: 24, fontWeight: "600" }}>
            {getGreeting()}
          </Text>

          <VerseOfTheDay />

          {now.data?.show && (
            <NowPlayingCard
              data={{
                title: now.data.show.title,
                host: now.data.show.host,
                isLive: now.data.isLive,
              }}
            />
          )}

          {/* CTA Support */}
          <View
            style={{
              marginTop: spacing.xl,
              paddingTop: spacing.lg,
              borderTopWidth: 0.5,
              borderColor: "rgba(0,0,0,0.08)",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                textAlign: "center",
                opacity: 0.7,
                marginBottom: 8,
              }}
            >
              Help us continue this mission
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate("Give")}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#2F5D9F",
                }}
              >
                Support the Mission →
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}