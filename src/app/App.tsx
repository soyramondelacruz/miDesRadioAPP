import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 24, gap: 8 }}>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>miDes Radio</Text>
        <Text style={{ fontSize: 16 }}>
          Base del proyecto lista. Próximo: reproductor en vivo.
        </Text>
      </View>
    </SafeAreaView>
  );
}