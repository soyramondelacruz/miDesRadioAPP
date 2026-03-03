import { Dimensions, Platform, PixelRatio } from "react-native";

const { width: W, height: H } = Dimensions.get("window");

// base (iPhone 14 aprox)
const BASE_W = 390;

export function clamp(n: number, min: number, max: number) {
  "worklet";
  return Math.max(min, Math.min(max, n));
}

export function vw(pxAtBase: number) {
  // escala por ancho, con clamp para no exagerar en tablets ni romper en SE
  const scaled = (W / BASE_W) * pxAtBase;
  return clamp(scaled, pxAtBase * 0.85, pxAtBase * 1.12);
}

export function isSmallPhone() {
  // iPhone SE / mini suelen caer aquí
  return W <= 360 || H <= 700;
}

export function hairline() {
  return Platform.select({
    ios: 0.5,
    android: 1 / PixelRatio.get(),
    default: 1,
  }) as number;
}