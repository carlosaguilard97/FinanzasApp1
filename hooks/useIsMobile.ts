import { useWindowDimensions, Platform } from "react-native";

/**
 * Retorna true si:
 * - Es un dispositivo nativo (iOS/Android), o
 * - Es web con ancho <= 1180px (cubre móvil, tablet portrait y tablet landscape)
 *
 * > 1180px se considera desktop — muestra links y ConfirmDialog en lugar de swipe.
 */
export function useIsMobile(): boolean {
  const { width } = useWindowDimensions();

  if (Platform.OS !== "web") return true;

  return width <= 1366;
}
