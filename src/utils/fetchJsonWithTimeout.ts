export async function fetchJsonWithTimeout<T>(
  url: string,
  timeoutMs: number
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} al pedir ${url}`);
    }

    // Nota: res.json() puede fallar si el servidor devuelve HTML o texto inválido
    const data = (await res.json()) as T;
    return data;
  } finally {
    clearTimeout(timeout);
  }
}