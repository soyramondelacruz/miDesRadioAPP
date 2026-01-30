import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { RADIO_CONFIG } from "../config/radio.config";
import { delay } from "../utils/delay";

type Player = ReturnType<typeof createAudioPlayer>;

class AudioService {
  private player: Player | null = null;
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    // Modo mínimo y conservador: evita incompatibilidades de tipos en Android.
    // Si setAudioModeAsync falla, NO bloqueamos el playback (MVP first).
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        allowsRecording: false,
        // ⚠️ NO usamos interruptionMode aquí por incompatibilidad observada en algunas versiones Android.
      });
    } catch (e) {
      // No frenar el reproductor por settings; seguimos.
      if (__DEV__) {
        console.warn("[miDes] setAudioModeAsync failed (non-fatal):", e);
      }
    }

    this.initialized = true;
  }

  private ensurePlayer(): Player {
    if (!this.player) {
      this.player = createAudioPlayer(RADIO_CONFIG.STREAM_URL);
    }
    return this.player;
  }

  async playWithReconnect(): Promise<void> {
    await this.init();

    let attempt = 0;
    let lastError: unknown = null;

    while (attempt < RADIO_CONFIG.RECONNECT.MAX_ATTEMPTS) {
      try {
        const p = this.ensurePlayer();
        await p.play();
        return;
      } catch (err) {
        lastError = err;
        attempt += 1;

        const backoff = RADIO_CONFIG.RECONNECT.BASE_DELAY_MS * attempt;
        await delay(backoff);

        await this.reset();
      }
    }

    throw lastError ?? new Error("No se pudo conectar al stream.");
  }

  async pause(): Promise<void> {
    if (!this.player) return;
    await this.player.pause();
  }

  async stop(): Promise<void> {
    if (!this.player) return;
    await this.player.pause();
    await this.reset();
  }

  async reset(): Promise<void> {
    if (!this.player) return;

    try {
      this.player.release();
    } finally {
      this.player = null;
    }
  }
}

export const audioService = new AudioService();