import { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
}

const CONFIG: Record<ToastType, { bg: string; icon: string; duration: number }> = {
  success: { bg: "#10B981", icon: "✓", duration: 2500 },
  error:   { bg: "#EF4444", icon: "✕", duration: 3000 },
  warning: { bg: "#F59E0B", icon: "!",  duration: 3000 },
  info:    { bg: "#6366F1", icon: "i",  duration: 2500 },
};

export function Toast({ message, type = "info", visible, onHide }: ToastProps) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    if (!visible) return;
    const cfg = CONFIG[type];

    Animated.parallel([
      Animated.timing(opacity,     { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY,  { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity,    { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 16, duration: 220, useNativeDriver: true }),
      ]).start(() => onHide());
    }, cfg.duration);

    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  const cfg = CONFIG[type];

  return (
    <Animated.View style={[styles.wrap, { opacity, transform: [{ translateY }] }]}>
      <View style={[styles.toast, { backgroundColor: cfg.bg }]}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{cfg.icon}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom:   104,
    left:     16,
    right:    16,
    zIndex:   999,
  },
  toast: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            12,
    paddingVertical:  14,
    paddingHorizontal: 16,
    borderRadius:   16,
    shadowColor:    "#000",
    shadowOffset:   { width: 0, height: 4 },
    shadowOpacity:  0.15,
    shadowRadius:   10,
    elevation:      6,
  },
  iconWrap: {
    width:          28,
    height:         28,
    borderRadius:   14,
    backgroundColor:"rgba(255,255,255,0.25)",
    alignItems:     "center",
    justifyContent: "center",
  },
  icon:    { color: "#fff", fontSize: 12, fontWeight: "700" },
  message: { color: "#fff", fontSize: 14, fontWeight: "500", flex: 1 },
});
