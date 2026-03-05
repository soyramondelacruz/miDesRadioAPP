import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  TextInput,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { spacing } from "../theme";
import { weeklySchedule, STATION_TIMEZONE, Program } from "../data/schedule";
import { programCatalogById } from "../data/programCatalog";
import { getProgramVisuals } from "../data/programVisuals";

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function isNowInProgram(nowMin: number, start: number, end: number) {
  if (end > start) return nowMin >= start && nowMin < end;
  return nowMin >= start || nowMin < end; // cruza medianoche
}

function getStationNow(baseDate: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: STATION_TIMEZONE,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  });

  const parts = formatter.formatToParts(baseDate);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const weekdayStr = parts.find((p) => p.type === "weekday")?.value ?? "Mon";

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return { day: weekdayMap[weekdayStr], minutes: hour * 60 + minute };
}

function uniqBy<T>(arr: T[], keyFn: (x: T) => string) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of arr) {
    const k = keyFn(item);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(item);
    }
  }
  return out;
}

export function ProgramsHubScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState("");

  // 1) Flatten weeklySchedule -> lista de programas (únicos por id)
  const basePrograms = useMemo(() => {
    const flat: Program[] = [];
    Object.values(weeklySchedule).forEach((dayList) => {
      (dayList ?? []).forEach((p) => flat.push(p));
    });
    return uniqBy(flat, (p) => p.id);
  }, []);

  // 2) Merge con catalog (SEGURO)
  const mergedPrograms = useMemo(() => {
    const catalogById: Record<string, any> = programCatalogById ?? {};

    return basePrograms.map((p) => {
      const cat = p?.id ? catalogById[p.id] : undefined;

      return {
        ...p,
        // editorial
        title: cat?.title ?? p.title,
        host: cat?.subtitle ?? p.host,
        description: cat?.description,
        visualKey: cat?.visualKey,
        featured: !!cat?.featured,
      };
    });
  }, [basePrograms]);

  // 3) Search
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return mergedPrograms;

    return mergedPrograms.filter((p: any) => {
      const t = String(p.title ?? "").toLowerCase();
      const h = String(p.host ?? "").toLowerCase();
      return t.includes(s) || h.includes(s);
    });
  }, [mergedPrograms, q]);

  // 4) Now (para badge LIVE en el futuro si quieres)
  const { day, minutes } = useMemo(() => getStationNow(new Date()), []);
  const nowId = useMemo(() => {
    const today = weeklySchedule[day] ?? [];
    const current = today.find((p) =>
      isNowInProgram(minutes, timeToMinutes(p.start), timeToMinutes(p.end))
    );
    return current?.id ?? null;
  }, [day, minutes]);

  function openProgram(p: any) {
    // aquí puedes navegar a ProgramDetail o abrir sheet
    // navigation.navigate("ProgramDetail", { id: p.id })
    console.log("open program", p.id);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0E1624" }}>
      {/* Header (simple, puedes hacerlo igual que Radio/Home si quieres) */}
      <LinearGradient
        colors={["#0B1220", "#1E4F93", "#1F5FAE", "#163A6B", "#0E1624"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1.25 }}
        style={{
          paddingTop: Math.max(insets.top, 14) - 6,
          paddingHorizontal: spacing.lg,
          paddingBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 18, fontWeight: "900", color: "#fff" }}>Programas</Text>
          <Pressable
            onPress={() => navigation.goBack?.()}
            style={({ pressed }) => ({
              width: 38,
              height: 38,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: pressed ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.10)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.14)",
            })}
          >
            <Feather name="x" size={18} color="#fff" />
          </Pressable>
        </View>

        {/* Search */}
        <View
          style={{
            marginTop: 12,
            borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.10)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.14)",
            paddingHorizontal: 12,
            paddingVertical: Platform.OS === "ios" ? 10 : 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Feather name="search" size={16} color="rgba(255,255,255,0.85)" />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Buscar programa o host…"
            placeholderTextColor="rgba(255,255,255,0.55)"
            style={{
              flex: 1,
              color: "#fff",
              fontWeight: "700",
              padding: 0,
            }}
          />
        </View>
      </LinearGradient>

      {/* Grid */}
      <FlatList
        data={list as any[]}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xl + insets.bottom,
          paddingTop: 14,
        }}
        columnWrapperStyle={{ gap: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => {
          const { artwork } = getProgramVisuals(item); // usa visualKey o specialId si lo tienes
          const isLive = nowId === item.id;

          return (
            <Pressable
              onPress={() => openProgram(item)}
              style={({ pressed }) => ({
                flex: 1,
                borderRadius: 18,
                overflow: "hidden",
                backgroundColor: pressed ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
                transform: [{ scale: pressed ? 0.99 : 1 }],
              })}
            >
              {/* Artwork grande */}
              <View style={{ width: "100%", aspectRatio: 1, backgroundColor: "rgba(0,0,0,0.25)" }}>
                <Image source={artwork} style={{ width: "100%", height: "100%" }} resizeMode="cover" />

                {/* Badge LIVE opcional */}
                {isLive ? (
                  <View
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                      backgroundColor: "rgba(239,68,68,0.92)",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <View style={{ width: 6, height: 6, borderRadius: 99, backgroundColor: "#fff" }} />
                    <Text style={{ color: "#fff", fontWeight: "900", fontSize: 11, letterSpacing: 0.8 }}>
                      LIVE
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Text debajo */}
              <View style={{ padding: 12, gap: 4 }}>
                <Text numberOfLines={1} style={{ color: "#fff", fontWeight: "900", fontSize: 14 }}>
                  {item.title}
                </Text>
                <Text numberOfLines={1} style={{ color: "rgba(255,255,255,0.70)", fontWeight: "800", fontSize: 12 }}>
                  {item.host ?? "miDes Radio"}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}