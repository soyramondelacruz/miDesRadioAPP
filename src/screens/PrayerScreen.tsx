import React, { useMemo, useState } from "react";
import { ScrollView, Text, View, TextInput, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, radius } from "../theme";

export function PrayerScreen() {
  const [name, setName] = useState("");
  const [request, setRequest] = useState("");

  const canSend = useMemo(() => {
    return request.trim().length >= 10;
  }, [request]);

  function handleSend() {
    // Por ahora: placeholder de producción (no rompe). Luego conectamos a backend / email / WhatsApp / Airtable.
    Alert.alert(
      "Recibido 🙏",
      "Gracias por compartir tu petición. Estaremos orando contigo.",
      [{ text: "OK" }]
    );
    setName("");
    setRequest("");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#B2CEEE", "#FAF8FA"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: spacing.xl,
            gap: spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 26, fontWeight: "800", color: "#0B1B33" }}>
              Oración
            </Text>
            <Text style={{ fontSize: 14, opacity: 0.75, color: "#0B1B33" }}>
              Comparte tu petición. No estás solo(a).
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.92)",
              borderRadius: 18,
              padding: spacing.lg,
              gap: spacing.md,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 10 },
              elevation: 8,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "800", letterSpacing: 1, color: colors.primary }}>
              PETICIÓN DE ORACIÓN
            </Text>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, opacity: 0.7 }}>Nombre (opcional)</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre"
                placeholderTextColor="rgba(0,0,0,0.35)"
                style={{
                  backgroundColor: "rgba(255,255,255,0.98)",
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.08)",
                  borderRadius: 14,
                  paddingHorizontal: spacing.md,
                  paddingVertical: 12,
                }}
              />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, opacity: 0.7 }}>¿Por qué podemos orar?</Text>
              <TextInput
                value={request}
                onChangeText={setRequest}
                placeholder="Escribe tu petición aquí…"
                placeholderTextColor="rgba(0,0,0,0.35)"
                multiline
                style={{
                  minHeight: 120,
                  textAlignVertical: "top",
                  backgroundColor: "rgba(255,255,255,0.98)",
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.08)",
                  borderRadius: 14,
                  paddingHorizontal: spacing.md,
                  paddingVertical: 12,
                }}
              />
            </View>

            <Pressable
              onPress={handleSend}
              disabled={!canSend}
              style={{
                marginTop: spacing.sm,
                borderRadius: 14,
                paddingVertical: 12,
                alignItems: "center",
                backgroundColor: colors.primary,
                opacity: canSend ? 1 : 0.45,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800" }}>Enviar petición</Text>
            </Pressable>

            <Text style={{ fontSize: 12, opacity: 0.65, lineHeight: 18 }}>
              “Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús” 
            </Text>
            <Text style={{ fontSize: 12, opacity: 0.65, lineHeight: 18, marginTop: -16, textAlign:"right" }}>
               — Filipenses 4:19
            </Text>
          </View>

          <View
            style={{
              borderRadius: 18,
              padding: spacing.lg,
              backgroundColor: "rgba(255,255,255,0.75)",
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "800", letterSpacing: 1, color: colors.accent }}>
              ORACIÓN GUIADA
            </Text>
            <Text style={{ fontSize: 14, lineHeight: 22, color: "#0B1B33", opacity: 0.85 }}>
              Señor Jesús, hoy pongo mi vida en tus manos. Renueva mi fe, trae paz a mi mente
              y fortalece mi corazón. Que tu Espíritu Santo me guíe y me sostenga. Amén.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}