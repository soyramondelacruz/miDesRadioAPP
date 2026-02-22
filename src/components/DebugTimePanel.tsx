import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { colors, spacing } from "../theme";
import { STATION_TIMEZONE } from "../data/schedule";
import { useRadioPlayer } from "../context/RadioPlayerContext";

function isValidHHMM(value: string) {
  // HH:mm
  if (value.length !== 5) return false;
  if (value[2] !== ":") return false;

  const [hStr, mStr] = value.split(":");
  const h = Number(hStr);
  const m = Number(mStr);

  if (Number.isNaN(h) || Number.isNaN(m)) return false;
  if (h < 0 || h > 23) return false;
  if (m < 0 || m > 59) return false;

  return true;
}

function isValidYMD(value: string) {
  // YYYY-MM-DD (sin validar calendario perfecto; suficiente para debug)
  if (value.length !== 10) return false;
  if (value[4] !== "-" || value[7] !== "-") return false;

  const [yStr, moStr, dStr] = value.split("-");
  const y = Number(yStr);
  const mo = Number(moStr);
  const d = Number(dStr);

  if (Number.isNaN(y) || Number.isNaN(mo) || Number.isNaN(d)) return false;
  if (y < 1970 || y > 2100) return false;
  if (mo < 1 || mo > 12) return false;
  if (d < 1 || d > 31) return false;

  return true;
}

// Obtiene YYYY-MM-DD “de hoy” en la zona horaria de la estación (RD)
function getStationTodayYMD(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year")?.value ?? "1970";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

export function DebugTimePanel() {
  const { simulatedISOTime, applySimulatedTime, resetSimulatedTime } =
    useRadioPlayer();

  // defaults (hoy en RD + hora ejemplo)
  const [ymd, setYmd] = useState(() => getStationTodayYMD(STATION_TIMEZONE));
  const [hhmm, setHhmm] = useState("13:00");

  const modeLabel = simulatedISOTime ? "SIMULATED" : "REAL TIME";

  const helpText = useMemo(() => {
    return `Station TZ: ${STATION_TIMEZONE} (UTC-4). Use YYYY-MM-DD + HH:mm.`;
  }, []);

  const canApply = isValidYMD(ymd) && isValidHHMM(hhmm);

  function handleApply() {
    if (!canApply) return;

    // RD es UTC-4 todo el año (sin DST)
    const iso = `${ymd}T${hhmm}:00-04:00`;
    applySimulatedTime(iso);
  }

  function handleReset() {
    resetSimulatedTime();

    // opcional: reponer inputs al "hoy RD"
    setYmd(getStationTodayYMD(STATION_TIMEZONE));
  }

  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.75)",
        borderRadius: 16,
        padding: spacing.md,
        gap: spacing.sm,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: "800", color: colors.primary }}>
        DEBUG TIME — {modeLabel}
      </Text>

      <Text style={{ fontSize: 12, opacity: 0.7 }}>{helpText}</Text>

      {/* Fecha */}
      <View style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center" }}>
        <TextInput
          value={ymd}
          onChangeText={setYmd}
          placeholder="YYYY-MM-DD"
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.95)",
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.08)",
            borderRadius: 12,
            paddingHorizontal: spacing.md,
            paddingVertical: 10,
          }}
        />
      </View>

      {/* Hora + acciones */}
      <View style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center" }}>
        <TextInput
          value={hhmm}
          onChangeText={setHhmm}
          placeholder="HH:mm"
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.95)",
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.08)",
            borderRadius: 12,
            paddingHorizontal: spacing.md,
            paddingVertical: 10,
          }}
        />

        <Pressable
          onPress={handleApply}
          disabled={!canApply}
          style={{
            paddingHorizontal: spacing.md,
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor: colors.primary,
            opacity: canApply ? 1 : 0.5,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Apply</Text>
        </Pressable>

        <Pressable
          onPress={handleReset}
          style={{
            paddingHorizontal: spacing.md,
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor: "rgba(0,0,0,0.06)",
          }}
        >
          <Text style={{ fontWeight: "800" }}>Reset</Text>
        </Pressable>
      </View>

      <Text style={{ fontSize: 11, opacity: 0.6 }}>
        Simulated ISO: {simulatedISOTime ?? "—"}
      </Text>
    </View>
  );
}