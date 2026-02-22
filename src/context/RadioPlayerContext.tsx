import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Audio } from "expo-av";
import { RADIO_CONFIG } from "../config/radio.config";
import { useNowPlaying } from "../hooks/useNowPlaying";

type Status = "idle" | "playing" | "paused" | "loading" | "error";

interface RadioContextType {
  status: Status;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  now: ReturnType<typeof useNowPlaying>;

  // ✅ Debug time (global)
  simulatedISOTime: string | null;
  applySimulatedTime: (iso: string) => void;
  resetSimulatedTime: () => void;

  // ✅ Hora efectiva para UI (Home greeting, etc.)
  effectiveNow: Date;
}

const RadioContext = createContext<RadioContextType | null>(null);

export function RadioPlayerProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReconnectingRef = useRef(false);

  const [status, setStatus] = useState<Status>("idle");

  // ✅ Debug time global
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

  /* ===============================
     AUDIO MODE (BACKGROUND REAL)
  =============================== */
  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      shouldDuckAndroid: false,
    });
  }, []);

  /* ===============================
     STATUS LISTENER
  =============================== */
  const onPlaybackStatusUpdate = useCallback((statusUpdate: any) => {
    if (!statusUpdate?.isLoaded) {
      if (statusUpdate?.error) {
        console.log("Stream error:", statusUpdate.error);
      }
      return;
    }

    if (statusUpdate.isPlaying) setStatus("playing");
    else setStatus((prev) => (prev === "loading" ? "paused" : prev));
  }, []);

  /* ===============================
     LOAD & CREATE SOUND
  =============================== */
  const createSound = useCallback(async () => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: RADIO_CONFIG.STREAM_URL },
      { shouldPlay: false },
      onPlaybackStatusUpdate
    );

    soundRef.current = sound;
  }, [onPlaybackStatusUpdate]);

  /* ===============================
     RECONNECT LOGIC
  =============================== */
  const reconnect = useCallback(async () => {
    if (isReconnectingRef.current) return;

    isReconnectingRef.current = true;
    setStatus("loading");

    try {
      await soundRef.current?.unloadAsync();
      soundRef.current = null;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      reconnectTimeoutRef.current = setTimeout(async () => {
        try {
          await createSound();
          await soundRef.current?.playAsync();
        } catch (err) {
          console.log("Reconnect failed:", err);
          setStatus("error");
        } finally {
          isReconnectingRef.current = false;
        }
      }, 2500);
    } catch (err) {
      console.log("Reconnect outer error:", err);
      setStatus("error");
      isReconnectingRef.current = false;
    }
  }, [createSound]);

  /* ===============================
     PLAY
  =============================== */
  const play = useCallback(async () => {
    if (status === "playing" || status === "loading") return;

    try {
      setStatus("loading");

      if (!soundRef.current) {
        await createSound();
      }

      await soundRef.current?.playAsync();
      setStatus("playing");
    } catch (err) {
      console.log("Play error:", err);
      setStatus("error");
      reconnect();
    }
  }, [status, createSound, reconnect]);

  /* ===============================
     PAUSE
  =============================== */
  const pause = useCallback(async () => {
    try {
      await soundRef.current?.pauseAsync();
      setStatus("paused");
    } catch (err) {
      console.log("Pause error:", err);
    }
  }, []);

  /* ===============================
     CLEANUP
  =============================== */
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      soundRef.current?.unloadAsync();
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
  if (!context) {
    throw new Error("useRadioPlayer must be used inside RadioPlayerProvider");
  }
  return context;
}