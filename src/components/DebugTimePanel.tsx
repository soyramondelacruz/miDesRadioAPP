import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { SCHEDULE_DEBUG } from "../data/schedule";

export function DebugTimePanel({
  onTimeChange,
}: {
  onTimeChange: () => void;
}) {
  const [value, setValue] = useState("");

  if (!__DEV__) return null;

  return (
    <View
      style={{
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#fff3cd",
        gap: 12,
      }}
    >
      <Text style={{ fontWeight: "700" }}>
        ⏱ Debug Hora (Rep. Dominicana)
      </Text>

      <TextInput
        placeholder="2026-02-23T11:59:00"
        value={value}
        onChangeText={setValue}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          borderRadius: 8,
        }}
      />

      <Pressable
        onPress={() => {
          SCHEDULE_DEBUG.simulatedISOTime = value;
          onTimeChange(); // 👈 AQUÍ
        }}
        style={{
          backgroundColor: "#184f92",
          padding: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Aplicar Hora
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          SCHEDULE_DEBUG.simulatedISOTime = null;
          onTimeChange(); // 👈 AQUÍ
        }}
        style={{
          backgroundColor: "#999",
          padding: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Volver a Hora Real
        </Text>
      </Pressable>
    </View>
  );
}