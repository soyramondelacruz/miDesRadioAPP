import React, { useMemo } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { useSchedule } from "../hooks/useSchedule";
import { getTodayWeekday, rotateWeek } from "../utils/date";

export function ScheduleScreen() {
  const { data, loading, error, reload } = useSchedule();

  const orderedWeek = useMemo(() => {
    if (!data) return [];
    const tz = data.timezone || "America/Santo_Domingo";
    const today = getTodayWeekday(tz);
    return rotateWeek(data.week, today);
  }, [data]);

  const todayLabel = useMemo(() => {
    if (!data) return null;
    const tz = data.timezone || "America/Santo_Domingo";
    return getTodayWeekday(tz);
  }, [data]);

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "800" }}>Programación</Text>

      {loading ? <Text>Cargando…</Text> : null}

      {error ? (
        <View style={{ gap: 8 }}>
          <Text style={{ color: "red" }}>Error: {error}</Text>
          <Button title="Reintentar" onPress={reload} />
        </View>
      ) : null}

      {data ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <Text style={{ opacity: 0.7, marginBottom: 6 }}>
            Zona horaria: {data.timezone}
          </Text>

          {todayLabel ? (
            <Text style={{ opacity: 0.8, marginBottom: 12 }}>
              Hoy: {todayLabel}
            </Text>
          ) : null}

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
        </ScrollView>
      ) : null}
    </View>
  );
}