import React from "react";
import { Text, ScrollView, RefreshControl, View } from "react-native";
import { useLinks } from "../hooks/useLinks";
import { ActionButton } from "../components/ActionButton";

export function InteractionScreen() {
  const { links, loading, refresh } = useLinks();

  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, gap: 14 }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      <Text style={{ fontSize: 24, fontWeight: "800" }}>Conecta con miDes</Text>

      <Text style={{ opacity: 0.8 }}>
        Escríbenos, síguenos y sé parte de la comunidad.
      </Text>

      {/* WhatsApp general */}
      <ActionButton label="💬 WhatsApp" value={links.whatsapp} />

      <View style={{ height: 6 }} />
      <Text style={{ fontSize: 16, fontWeight: "800" }}>Acciones rápidas</Text>

      <ActionButton
        label="🙏 Pedir oración"
        value={links.whatsapp_prayer}
        isWhatsApp
      />
      <ActionButton
        label="👋 Saludar al aire"
        value={links.whatsapp_greeting}
        isWhatsApp
      />
      <ActionButton
        label="🎶 Solicitar canción"
        value={links.whatsapp_song}
        isWhatsApp
      />
      <ActionButton
        label="✨ Enviar testimonio"
        value={links.whatsapp_testimony}
        isWhatsApp
        />

      <View style={{ height: 10 }} />
      <Text style={{ fontSize: 16, fontWeight: "800" }}>Redes</Text>

      <ActionButton label="▶️ YouTube" value={links.youtube} />
      <ActionButton label="📸 Instagram" value={links.instagram} />
      <ActionButton label="📘 Facebook" value={links.facebook} />
    </ScrollView>
  );
}