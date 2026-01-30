import { useCallback, useEffect, useRef, useState } from "react";
import { PlayerState } from "../types/radio.types";
import { audioService } from "../services/audio.service";

const WATCHDOG_INTERVAL_MS = 2500;

export function useRadioPlayer() {
  const [state, setState] = useState<PlayerState>({
    status: "idle",
    errorMessage: undefined,
    isLive: false,
  });

  // Evita reconectar si el usuario pausó/paró manualmente
  const userStoppedRef = useRef(false);
  const watchdogRef = useRef<NodeJS.Timeout | null>(null);

  const clearWatchdog = () => {
    if (watchdogRef.current) {
      clearInterval(watchdogRef.current);
      watchdogRef.current = null;
    }
  };

  const startWatchdog = () => {
    clearWatchdog();

    watchdogRef.current = setInterval(async () => {
      if (userStoppedRef.current) return;
      if (state.status !== "playing") return;

      try {
        // Intento silencioso: si el stream murió, esto suele lanzar error
        await audioService.playWithReconnect();
      } catch {
        setState({
          status: "error",
          errorMessage: "Reconectando transmisión…",
          isLive: false,
        });
      }
    }, WATCHDOG_INTERVAL_MS);
  };

  useEffect(() => {
    audioService.init().catch(() => {
      /* manejado al reproducir */
    });

    return () => clearWatchdog();
  }, []);

  const play = useCallback(async () => {
    userStoppedRef.current = false;
    setState({ status: "loading", isLive: false });

    try {
      await audioService.playWithReconnect();
      setState({ status: "playing", isLive: true });
      startWatchdog();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al iniciar transmisión.";
      setState({ status: "error", errorMessage: msg, isLive: false });
    }
  }, []);

  const pause = useCallback(async () => {
    userStoppedRef.current = true;
    clearWatchdog();
    await audioService.pause();
    setState({ status: "paused", isLive: false });
  }, []);

  const stop = useCallback(async () => {
    userStoppedRef.current = true;
    clearWatchdog();
    await audioService.stop();
    setState({ status: "idle", isLive: false });
  }, []);

  return { state, play, pause, stop };
}