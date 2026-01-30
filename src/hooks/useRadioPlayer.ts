import { useCallback, useEffect, useState } from "react";
import { PlayerState } from "../types/radio.types";
import { audioService } from "../services/audio.service";

export function useRadioPlayer() {
  const [state, setState] = useState<PlayerState>({
    status: "idle",
    errorMessage: undefined,
    isLive: false,
  });

  useEffect(() => {
    audioService.init().catch(() => {
      // se manejará al intentar reproducir
    });
  }, []);

  const setFromStatus = useCallback((status: PlayerState["status"], errorMessage?: string) => {
    setState({
      status,
      errorMessage,
      isLive: status === "playing",
    });
  }, []);

  const play = useCallback(async () => {
    setFromStatus("loading");

    try {
      await audioService.playWithReconnect();
      setFromStatus("playing");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error desconocido al reproducir.";
      setFromStatus("error", msg);
    }
  }, [setFromStatus]);

  const pause = useCallback(async () => {
    await audioService.pause();
    setFromStatus("paused");
  }, [setFromStatus]);

  const stop = useCallback(async () => {
    await audioService.stop();
    setFromStatus("idle");
  }, [setFromStatus]);

  return { state, play, pause, stop };
}