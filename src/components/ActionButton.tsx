import React from "react";
import { TouchableOpacity, Text, Linking } from "react-native";
import type { LinkValue } from "../types/links.types";
import { buildWhatsAppUrl } from "../utils/whatsapp";

type Props = {
  label: string;
  value?: LinkValue;
  // Si true, se interpreta como whatsapp y se aplica ?text= cuando haya message
  isWhatsApp?: boolean;
};

export function ActionButton({ label, value, isWhatsApp }: Props) {
  if (!value) return null;

  let url: string | undefined;

  if (typeof value === "string") {
    url = value;
  } else {
    url = isWhatsApp ? buildWhatsAppUrl(value.url, value.message) : value.url;
  }

  if (!url) return null;

  const onPress = () => {
    Linking.openURL(url).catch(() => {
      alert("No se pudo abrir el enlace.");
    });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "700" }}>{label}</Text>
    </TouchableOpacity>
  );
}