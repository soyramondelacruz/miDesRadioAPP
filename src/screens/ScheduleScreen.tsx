import React, { useMemo } from "react";
import { View, Text, ScrollView, Button, RefreshControl } from "react-native";
import { useSchedule } from "../hooks/useSchedule";
import { DevDataSourceBadge } from "../components/DevDataSourceBadge";
import { getTodayWeekday, rotateWeek } from "../utils/date";

export function ScheduleScreen() {
  const { data, loading, refreshing, error, reload, refresh, source } = useSchedule();

  const orderedWeek = useMemo(() => {
    if (!data) return [];
    const tz = data.timezone || "America/Santo_Domingo";
    const today = getTodayWeekday(tz);
    return rotateWeek(data.week, today);
  }, [data]);

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "800" }}>Programación</Text>

      <DevDataSourceBadge source={source} />

      {loading ? <Text>Cargando…</Text> : null}

      {error ? (
        <View style={{ gap: 8 }}>
          <Text style={{ color: "red" }}>Error: {error}</Text>
          <Button title="Reintentar" onPress={reload} />
        </View>
      ) : null}

      {data ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        >
          <Text style={{ opacity: 0.7, marginBottom: 12 }}>
            Zona horaria: {data.timezone}
          </Text>

          {orderedWeek.map((day, index) => {
            const isToday = index === 0;

            return (
              <View key={day.day} style={{ marginBottom: 18, gap: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: "800" }}>
                  {isToday ? `📌 ${day.day} (Hoy)` : day.day}
                </Text>

                {day.items.length === 0 ? (
                  <Text style={{ opacity: 0.7 }}>Sin programación</Text>
                ) : null}

                {day.items.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      padding: 12,
                      borderWidth: 1,
                      borderColor: "#e5e5e5",
                      borderRadius: 12,
                      gap: 4,
                      backgroundColor: isToday ? "#fafafa" : "transparent",
                    }}
                  >
                    <Text style={{ fontWeight: "800" }}>
                      {item.startTime}–{item.endTime} • {item.title}
                    </Text>
                    <Text style={{ opacity: 0.8 }}>
                      Tipo: {item.type.toUpperCase()}
                    </Text>
                    {item.description ? <Text>{item.description}</Text> : null}
                    {item.tags?.length ? (
                      <Text style={{ opacity: 0.7 }}>
                        Tags: {item.tags.join(", ")}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            );
          })}

          <Text style={{ opacity: 0.6 }}>
            Desliza hacia abajo para refrescar (ignora TTL).
          </Text>
        </ScrollView>
      ) : null}
    </View>
  );
}