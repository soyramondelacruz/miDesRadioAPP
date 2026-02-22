import React from "react";
import { View, Text, TouchableOpacity, Linking, ScrollView } from "react-native";

export function DonationScreen() {
  const handleDonate = () => {
    Linking.openURL("https://www.paypal.com/donate?hosted_button_id=TU_ID_AQUI");
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 28,
        justifyContent: "center",
      }}
    >
      <View style={{ gap: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Support the Mission
        </Text>

        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          This platform exists to share faith, hope and encouragement
          around the world.
        </Text>

        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          Your generosity helps us continue this mission.
        </Text>

        <TouchableOpacity
          onPress={handleDonate}
          style={{
            marginTop: 10,
            backgroundColor: "#2F5D9F",
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Give Securely via PayPal
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            marginTop: 16,
            fontSize: 12,
            textAlign: "center",
            opacity: 0.5,
          }}
        >
          Donations are voluntary and securely processed.
        </Text>
      </View>
    </ScrollView>
  );
}