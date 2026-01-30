import { Alert, Linking } from "react-native";

type Options = {
  fallbackUrl?: string;
  failureMessage?: string;
};

export async function openExternalLink(
  url: string,
  options: Options = {}
): Promise<void> {
  const failureMessage =
    options.failureMessage ?? "No se pudo abrir el enlace en este dispositivo.";

  try {
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
      return;
    }

    // Fallback: intenta abrir un fallbackUrl si existe
    if (options.fallbackUrl) {
      const canOpenFallback = await Linking.canOpenURL(options.fallbackUrl);
      if (canOpenFallback) {
        await Linking.openURL(options.fallbackUrl);
        return;
      }
    }

    // Último intento: abrir el mismo URL (a veces canOpenURL es conservador)
    await Linking.openURL(url);
  } catch {
    Alert.alert("Enlace no disponible", failureMessage);
  }
}