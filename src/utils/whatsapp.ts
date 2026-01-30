export function buildWhatsAppUrl(baseUrl: string, message?: string) {
  if (!message) return baseUrl;

  const encoded = encodeURIComponent(message);
  const hasQuery = baseUrl.includes("?");

  // wa.me soporta ?text=...
  return `${baseUrl}${hasQuery ? "&" : "?"}text=${encoded}`;
}