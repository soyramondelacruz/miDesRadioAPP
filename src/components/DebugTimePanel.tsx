import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  currentTime: Date;
  onApply: (date: Date) => void;
  onReset: () => void;
}

export function DebugTimePanel({
  currentTime,
  onApply,
  onReset,
}: Props) {
  const [localTime, setLocalTime] = useState<Date>(currentTime);

  function addHour() {
    const updated = new Date(localTime.getTime() + 60 * 60 * 1000);
    setLocalTime(updated);
  }

  function subtractHour() {
    const updated = new Date(localTime.getTime() - 60 * 60 * 1000);
    setLocalTime(updated);
  }

  return (
    <View
      style={{
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        backgroundColor: "rgba(0,0,0,0.05)",
      }}
    >
      <Text style={{ marginBottom: 8, fontWeight: "600" }}>
        Debug Time
      </Text>

      <Text style={{ marginBottom: 12 }}>
        {localTime.toLocaleString()}
      </Text>

      <TouchableOpacity onPress={addHour}>
        <Text>+1 Hour</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={subtractHour}>
        <Text>-1 Hour</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onApply(localTime)}
        style={{ marginTop: 12 }}
      >
        <Text style={{ fontWeight: "600" }}>
          Apply Time
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onReset}
        style={{ marginTop: 8 }}
      >
        <Text style={{ opacity: 0.6 }}>
          Reset to Real Time
        </Text>
      </TouchableOpacity>
    </View>
  );
}