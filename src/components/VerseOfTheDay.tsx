import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  Share,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { colors, spacing } from "../theme";
import { useVerseOfTheDay } from "../hooks/useVerseOfTheDay";

interface Props {
  compact?: boolean;
}

export function VerseOfTheDay({ compact = false }: Props) {
  const { verse, reflection, loading } = useVerseOfTheDay();

  async function handleShare() {
    if (!verse) return;

    try {
      await Share.share({
        message: `“${verse.text}”\n\n${verse.reference}\n\n${reflection}\n\nCompartido desde miDesRadio`,
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  }

  if (loading) {
    return (
      <View style={{ padding: spacing.md }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!verse) return null;

  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.95)", "rgba(240,245,255,0.9)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 24,
        padding: compact ? spacing.md : spacing.lg,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 4,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Text
        style={{
          fontSize: 11,
          letterSpacing: 1.8,
          color: colors.accent,
          fontWeight: "600",
          marginBottom: spacing.xs,
        }}
      >
        VERSÍCULO DEL DÍA
      </Text>

      {/* Texto principal */}
      <Text
        style={{
          fontSize: compact ? 15 : 17,
          lineHeight: 24,
          color: "#2e3a59",
          fontStyle: "italic",
        }}
      >
        “{verse.text}”
      </Text>

      {/* Referencia alineada a la derecha */}
      <Text
        style={{
          marginTop: 8,
          fontSize: 13,
          fontWeight: "600",
          color: colors.primary,
          textAlign: "right",
        }}
      >
        — {verse.reference}
      </Text>

      {/* Reflexión */}
      <Text
        style={{
          marginTop: spacing.sm,
          fontSize: 13,
          lineHeight: 20,
          color: "#555",
        }}
      >
        {reflection}
      </Text>

      {/* Botón minimalista */}
      <Pressable
        onPress={handleShare}
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          padding: 6,
        }}
      >
        <Feather name="share-2" size={17} color={colors.primary} />
      </Pressable>
    </LinearGradient>
  );
}