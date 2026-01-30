import React, { useMemo } from "react";
import { Text, ScrollView, RefreshControl, View } from "react-native";
import { useLinks } from "../hooks/useLinks";
import { ActionButton } from "../components/ActionButton";
import type { LinkAction } from "../types/links.types";

function sortActions(actions: LinkAction[]) {
  return [...actions]
    .filter((a) => a.enabled !== false)
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
}

export function InteractionScreen() {
  const { data, loading, refresh } = useLinks();

  const actionsBySection = useMemo(() => {
    if (!data?.actions?.length) return null;

    const sorted = sortActions(data.actions);

    return {
      primary: sorted.filter((a) => (a.section ?? "primary") === "primary"),
      quick: sorted.filter((a) => a.section === "quick"),
      social: sorted.filter((a) => a.section === "social"),
    };
  }, [data]);

  const links = data?.links ?? {};

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

      {/* MODO V2 (control editorial) */}
      {actionsBySection ? (
        <>
          {actionsBySection.primary.map((a) => (
            <ActionButton
              key={a.key}
              label={a.label}
              value={links[a.key]}
              isWhatsApp={a.isWhatsApp}
            />
          ))}

          {actionsBySection.quick.length ? (
            <>
              <View style={{ height: 6 }} />
              <Text style={{ fontSize: 16, fontWeight: "800" }}>
                Acciones rápidas
              </Text>

              {actionsBySection.quick.map((a) => (
                <ActionButton
                  key={a.key}
                  label={a.label}
                  value={links[a.key]}
                  isWhatsApp={a.isWhatsApp}
                />
              ))}
            </>
          ) : null}

          {actionsBySection.social.length ? (
            <>
              <View style={{ height: 10 }} />
              <Text style={{ fontSize: 16, fontWeight: "800" }}>Redes</Text>

              {actionsBySection.social.map((a) => (
                <ActionButton
                  key={a.key}
                  label={a.label}
                  value={links[a.key]}
                  isWhatsApp={a.isWhatsApp}
                />
              ))}
            </>
          ) : null}
        </>
      ) : (
        /* MODO V1 (compatibilidad) */
        <>
          <ActionButton label="💬 WhatsApp" value={links["whatsapp"]} />

          <View style={{ height: 6 }} />
          <Text style={{ fontSize: 16, fontWeight: "800" }}>Acciones rápidas</Text>

          <ActionButton label="🙏 Pedir oración" value={links["whatsapp_prayer"]} isWhatsApp />
          <ActionButton label="👋 Saludar al aire" value={links["whatsapp_greeting"]} isWhatsApp />
          <ActionButton label="🎶 Solicitar canción" value={links["whatsapp_song"]} isWhatsApp />
          <ActionButton label="✨ Enviar testimonio" value={links["whatsapp_testimony"]} isWhatsApp />

          <View style={{ height: 10 }} />
          <Text style={{ fontSize: 16, fontWeight: "800" }}>Redes</Text>

          <ActionButton label="▶️ YouTube" value={links["youtube"]} />
          <ActionButton label="📸 Instagram" value={links["instagram"]} />
          <ActionButton label="📘 Facebook" value={links["facebook"]} />
        </>
      )}
    </ScrollView>
  );
}