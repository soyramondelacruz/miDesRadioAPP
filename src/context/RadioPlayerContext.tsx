import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import * as Audio from "expo-audio";
import { RADIO_CONFIG } from "../config/radio.config";
import { useNowPlaying } from "../hooks/useNowPlaying";

type Status = "idle" | "playing" | "paused" | "loading" | "error";

interface RadioContextType {
  status: Status;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  now: ReturnType<typeof useNowPlaying>;

  simulatedISOTime: string | null;
  applySimulatedTime: (iso: string) => void;
  resetSimulatedTime: () => void;

  effectiveNow: Date;
}

const RadioContext = createContext<RadioContextType | null>(null);

export function RadioPlayerProvider({ children }: { children: React.ReactNode }) {
  const playerRef = useRef<ReturnType<typeof Audio.createAudioPlayer> | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReconnectingRef = useRef(false);

  const [status, setStatus] = useState<Status>("idle");

  const [simulatedISOTime, setSimulatedISOTime] = useState<string | null>(null);

  const now = useNowPlaying(30000);

  const effectiveNow = useMemo(() => {
    return simulatedISOTime ? new Date(simulatedISOTime) : new Date();
  }, [simulatedISOTime]);

  const applySimulatedTime = useCallback((iso: string) => {
    setSimulatedISOTime(iso);
  }, []);

  const resetSimulatedTime = useCallback(() => {
    setSimulatedISOTime(null);
  }, []);

  // ===============================
  // AUDIO MODE (BACKGROUND)
  // ===============================
  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionMode: "doNotMix",
        });
      } catch (e) {
        console.log("Audio mode error:", e);
      }
    })();
  }, []);

  // ===============================
  // Create / ensure player
  // ===============================
  const ensurePlayer = useCallback(() => {
    if (playerRef.current) return playerRef.current;

    const p = Audio.createAudioPlayer({ uri: RADIO_CONFIG.STREAM_URL });
    playerRef.current = p;
    return p;
  }, []);

  // ===============================
  // Lock screen metadata (important)
  // ===============================
  const activateLockScreen = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;

    const title =
      now.data?.show?.title ??
      now.data?.track?.title ??
      RADIO_CONFIG.APP_NAME;

    const artist =
      now.data?.show?.host ??
      now.data?.track?.artist ??
      "miDes";

    try {
      p.setActiveForLockScreen(true, {
        title,
        artist,
        albumTitle: RADIO_CONFIG.APP_NAME,
      });
    } catch (e) {
      console.log("Lock screen activation error:", e);
    }
  }, [now.data]);

  // ===============================
  // Reconnect
  // ===============================
  const reconnect = useCallback(async () => {
    if (isReconnectingRef.current) return;

    isReconnectingRef.current = true;
    setStatus("loading");

    try {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);

      reconnectTimeoutRef.current = setTimeout(async () => {
        try {
          const p = ensurePlayer();

          // Si tu versión soporta replace, ayuda mucho cuando el stream muere
          if (typeof (p as any).replace === "function") {
            await (p as any).replace({ uri: RADIO_CONFIG.STREAM_URL });
          }

          activateLockScreen();
          p.play();
          setStatus("playing");
        } catch (err) {
          console.log("Reconnect failed:", err);
          setStatus("error");
        } finally {
          isReconnectingRef.current = false;
        }
      }, 1500);
    } catch (err) {
      console.log("Reconnect outer error:", err);
      setStatus("error");
      isReconnectingRef.current = false;
    }
  }, [ensurePlayer, activateLockScreen]);

  // ===============================
  // PLAY
  // ===============================
  const play = useCallback(async () => {
    if (status === "playing" || status === "loading") return;

    try {
      setStatus("loading");

      // Re-aplicar modo por seguridad (barato y robusto)
      await Audio.setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: "doNotMix",
      });

      const p = ensurePlayer();
      activateLockScreen();

      p.play();
      setStatus("playing");
    } catch (err) {
      console.log("Play error:", err);
      setStatus("error");
      reconnect();
    }
  }, [status, ensurePlayer, activateLockScreen, reconnect]);

  // ===============================
  // PAUSE
  // ===============================
  const pause = useCallback(async () => {
    try {
      const p = playerRef.current;
      p?.pause();
      setStatus("paused");
    } catch (err) {
      console.log("Pause error:", err);
    }
  }, []);

  // ===============================
  // CLEANUP
  // ===============================
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      try {
        playerRef.current?.release?.();
      } catch {}
      playerRef.current = null;
    };
  }, []);

  return (
    <RadioContext.Provider
      value={{
        status,
        play,
        pause,
        now,
        simulatedISOTime,
        applySimulatedTime,
        resetSimulatedTime,
        effectiveNow,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}

export function useRadioPlayer() {
  const context = useContext(RadioContext);
  if (!context) throw new Error("useRadioPlayer must be used inside RadioPlayerProvider");
  return context;
}