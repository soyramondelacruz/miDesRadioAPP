import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { Image } from "react-native";
import { useRadioPlayer } from "../context/RadioPlayerContext";
import { VerseOfTheDay } from "../components/VerseOfTheDay";
import { spacing } from "../theme";
import { HomeScheduleCarousel } from "../components/HomeScheduleCarousel";
import { vw, isSmallPhone } from "../utils/responsive";

function QuickActionCard({
  label,
  title,
  subtitle,
  icon,
  onPress,
  variant = "glass",
  dense = false,
}: {
  label: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  variant?: "glass" | "donate";
  dense?: boolean;
}) {
  const isDonate = variant === "donate";

  // ✅ colores
  const donateAccent = "#C56B22"; // naranja miDes
  const normalAccent = "#9CC3FF"; // azul claro

  const Container = ({ children }: { children: React.ReactNode }) =>
    isDonate ? (
      <LinearGradient
        colors={["#1B2F4A", "#13243A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 18,
          paddingVertical: dense ? 12 : 14,
          paddingHorizontal: 14,
          minHeight: dense ? 92 : 98,
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.12)",
        }}
      >
        {/* Acento: barra naranja súper sutil */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 5,
            backgroundColor: donateAccent,
            opacity: 0.9,
          }}
        />
        {children}
      </LinearGradient>
    ) : (
      <View
        style={{
          flex: 1,
          borderRadius: 16,
          padding: spacing.md,
          backgroundColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.10)",
        }}
      >
        {children}
      </View>
    );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: dense ? 104 : 118,
        borderRadius: 16,
        overflow: "hidden",
        opacity: pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}
    >
      <Container>
        {/* top row: icon + chevron */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isDonate
                ? "rgba(197,107,34,0.18)"
                : "rgba(156,195,255,0.12)",
              borderWidth: 1,
              borderColor: isDonate
                ? "rgba(197,107,34,0.35)"
                : "rgba(156,195,255,0.18)",
            }}
          >
            <Feather
              name={icon}
              size={isDonate ? 19 : 18}
              color={isDonate ? donateAccent : normalAccent}
            />
          </View>

          <View style={{ opacity: 0.95 }}>
            <Feather
              name="chevron-right"
              size={18}
              color={isDonate ? donateAccent : normalAccent}
            />
          </View>
        </View>

        {/* text stack */}
        <View style={{ marginTop: dense ? 7 : 8, gap: 3 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "900",
              letterSpacing: 1.2,
              color: isDonate
                ? "rgba(255,255,255,0.82)"
                : "rgba(255,255,255,0.72)",
            }}
            numberOfLines={1}
          >
            {label}
          </Text>

          <Text
            style={{
              fontSize: dense ? 13 : 14,
              fontWeight: "800",
              color: "#fff",
              letterSpacing: -0.2,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>

          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: isDonate
                ? "rgba(255,255,255,0.92)"
                : "rgba(255,255,255,0.70)",
              lineHeight: 16,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {subtitle}
          </Text>
        </View>
      </Container>
    </Pressable>
  );
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const SMALL = isSmallPhone();

  const { now, status, play, pause } = useRadioPlayer();

  const isLoading = status === "loading";
  const isPlaying = status === "playing";

  // ✅ tokens responsive-safe
  const HEADER_PB = SMALL ? 58 : 66; // un poco más premium (menos “bloque”)
  const VERSE_OVERLAP = SMALL ? -36 : -44;
  const FAB_SIZE = SMALL ? 58 : 64;
  const FAB_BOTTOM = SMALL ? -22 : -26;

  /** ✅ Halo / pulse animation */
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isPlaying) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 850,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 850,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [isPlaying, pulse]);

  function handleFabPress() {
    if (isLoading) return;
    if (isPlaying) pause();
    else play();
  }

  const npTitle =
    now.data?.show?.title ??
    now.data?.track?.title ??
    now.data?.station ??
    "miDes Radio";

  const npHost = now.data?.show?.host ?? now.data?.track?.artist ?? "—";
  const npIsLive = !!now.data?.isLive;

  
  const HEADER_TOP = Math.max(insets.top, 14);
  const HEADER_BOTTOM = 85;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={[]}>
      <View style={{ flex: 1, backgroundColor: "#0E1624" }}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 28,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER (idéntico a RadioScreen, pero CTA Donar) */}
<LinearGradient
  colors={["#0B1220", "#1E4F93", "#1F5FAE", "#163A6B", "#0E1624"]}
  start={{ x: 0.5, y: 0 }}
  end={{ x: 0.5, y: 1.25 }}
  style={{
    paddingTop: HEADER_TOP - 10,
    paddingHorizontal: spacing.lg,
    paddingBottom: HEADER_PB,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  }}
>
  {/* watermark sutil */}
  <View
    pointerEvents="none"
    style={{
      position: "absolute",
      right: -16,
      top: -18,
      width: 190,
      height: 190,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.07)",
      transform: [{ rotate: "18deg" }],
    }}
  />
  <View
    pointerEvents="none"
    style={{
      position: "absolute",
      right: 30,
      top: 30,
      width: 110,
      height: 110,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.05)",
    }}
  />

  {/* Top row: logo + CTA */}
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginLeft: -25 }}>
      <Image
        source={require("../../assets/mides-radio-logo.png")}
        style={{
          width: 160,
          height: 56,
          resizeMode: "contain",
          marginTop: 12,
          paddingLeft: 0,
        }}
      />
    </View>

    <Pressable
      onPress={() => navigation.navigate("Give")}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.10)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.14)",
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <Feather name="heart" size={16} color="rgba(255,255,255,0.90)" />
      <Text style={{ fontSize: 13, fontWeight: "900", color: "rgba(255,255,255,0.95)" }}>
        Donar
      </Text>
    </Pressable>
  </View>
</LinearGradient>
     
          {/* CONTENIDO dark */}
          <View
            style={{
              paddingHorizontal: spacing.lg,
              paddingTop: 0,
              gap: spacing.md,
            }}
          >
            {/* Versículo flotante (overlap real) */}
            <View style={{ marginTop: VERSE_OVERLAP, position: "relative", zIndex: 20 }}>
              <VerseOfTheDay compact />

              {/* FAB invadiendo el card del versículo */}
              <View
                style={{
                  position: "absolute",
                  right: 14,
                  bottom: FAB_BOTTOM,
                  zIndex: 60,
                  elevation: 60,
                }}
              >
                {/* Halo animado */}
                {isPlaying && (
                  <Animated.View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      left: -(FAB_SIZE * 0.22),
                      top: -(FAB_SIZE * 0.22),
                      width: FAB_SIZE + 28,
                      height: FAB_SIZE + 28,
                      borderRadius: (FAB_SIZE + 28) / 2,
                      borderWidth: 2,
                      borderColor: "rgba(245, 158, 80, 0.65)",
                      backgroundColor: "rgba(245, 158, 80, 0.10)",
                      zIndex: 0,
                      transform: [
                        {
                          scale: pulse.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.98, 1.22],
                          }),
                        },
                      ],
                      opacity: pulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.55, 0.05],
                      }),
                    }}
                  />
                )}

                <Pressable
                  onPress={handleFabPress}
                  style={({ pressed }) => ({
                    width: FAB_SIZE,
                    height: FAB_SIZE,
                    borderRadius: FAB_SIZE / 2,
                    backgroundColor: "#FFFFFF",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: pressed ? 0.92 : 1,
                    borderWidth: 2,
                    borderColor: "#B2CEEE",
                    shadowColor: "#000",
                    shadowOpacity: 0.18,
                    shadowRadius: 18,
                    shadowOffset: { width: 0, height: 10 },
                    elevation: 16,
                    zIndex: 1,
                  })}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#184f92" />
                  ) : (
                    <Text
                      style={{
                        color: "#184f92",
                        fontSize: 24,
                        fontWeight: "900",
                        marginLeft: isPlaying ? 0 : 3,
                      }}
                    >
                      {isPlaying ? "❚❚" : "▶"}
                    </Text>
                  )}
                </Pressable>
              </View>

              {/* spacer para que el FAB no tape lo siguiente */}
              <View style={{ height: SMALL ? 18 : 22 }} />
            </View>

            {/* Programación (Carrusel) */}
            <View style={{ marginTop: SMALL ? 28 : 34 }}>
              <HomeScheduleCarousel onOpenRadio={() => navigation.navigate("Radio")} />
            </View>

            {/* Accesos rápidos — premium grid */}
            <View style={{ gap: spacing.sm, marginTop: 2 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "900",
                  color: "rgba(255,255,255,0.70)",
                  letterSpacing: 1,
                }}
              >
                ACCESOS RÁPIDOS
              </Text>

              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <QuickActionCard
                  dense={SMALL}
                  label="ESCUCHAR"
                  title="Radio en vivo"
                  subtitle="Alabanza • Oración"
                  icon="radio"
                  onPress={() => navigation.navigate("Radio")}
                />

                <QuickActionCard
                  dense={SMALL}
                  label="CRECER"
                  title="Podcasts"
                  subtitle="Mensajes • Devocionales"
                  icon="mic"
                  onPress={() => navigation.navigate("Podcasts")}
                />
              </View>

              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <QuickActionCard
                  dense={SMALL}
                  label="ORACIÓN"
                  title="Pide oración"
                  subtitle="Comparte tu necesidad"
                  icon="message-circle"
                  onPress={() => navigation.navigate("Prayer")}
                />

                <QuickActionCard
                  dense={SMALL}
                  label="DONAR"
                  title="Apoya"
                  subtitle="Haz crecer la misión"
                  icon="heart"
                  variant="donate"
                  onPress={() => navigation.navigate("Give")}
                />
              </View>
            </View>

            {/* Footer */}
            <View
              style={{
                marginTop: spacing.lg,
                paddingTop: spacing.md,
                borderTopWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Text style={{ fontSize: 12, opacity: 0.75, color: "#fff" }}>
                miDes Radio • Jesús • Esperanza • Vida
              </Text>

              <TouchableOpacity onPress={() => navigation.navigate("Give")}>
                <Text style={{ fontSize: 13, fontWeight: "900", color: "#9CC3FF" }}>
                  Apoyar la misión →
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 12 }} />
          </View>
        </ScrollView>
        
      </View>
    </SafeAreaView>
  );
}