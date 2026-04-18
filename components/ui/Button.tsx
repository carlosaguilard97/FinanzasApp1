import { Pressable, Text, ActivityIndicator, StyleSheet, View } from "react-native";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "lg" | "md" | "sm";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: string;
}

const VARIANT_STYLES = {
  primary:   { bg: "#6366F1", border: "#6366F1", text: "#FFFFFF" },
  secondary: { bg: "#FFFFFF", border: "#D1D5DB", text: "#374151" },
  danger:    { bg: "#EF4444", border: "#EF4444", text: "#FFFFFF" },
  ghost:     { bg: "transparent", border: "#6366F1", text: "#6366F1" },
};

const SIZE_STYLES = {
  lg: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 16, borderRadius: 16, iconSize: 18 },
  md: { paddingVertical: 13, paddingHorizontal: 20, fontSize: 15, borderRadius: 14, iconSize: 16 },
  sm: { paddingVertical: 9,  paddingHorizontal: 16, fontSize: 13, borderRadius: 10, iconSize: 14 },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = true,
  icon,
}: ButtonProps) {
  const v  = VARIANT_STYLES[variant];
  const sz = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => ({
        backgroundColor:  v.bg,
        borderColor:      v.border,
        borderWidth:      1,
        borderRadius:     sz.borderRadius,
        paddingVertical:  sz.paddingVertical,
        paddingHorizontal: sz.paddingHorizontal,
        flexDirection:    "row",
        alignItems:       "center",
        justifyContent:   "center",
        gap:              8,
        alignSelf:        fullWidth ? "stretch" : "flex-start",
        opacity:          isDisabled ? 0.5 : pressed ? 0.82 : 1,
        // Sombra solo en botones sólidos
        ...(variant === "primary" && !isDisabled ? {
          shadowColor:   "#6366F1",
          shadowOffset:  { width: 0, height: 3 },
          shadowOpacity: 0.25,
          shadowRadius:  6,
          elevation:     4,
        } : {}),
        ...(variant === "danger" && !isDisabled ? {
          shadowColor:   "#EF4444",
          shadowOffset:  { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius:  6,
          elevation:     4,
        } : {}),
      })}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "danger" ? "#fff" : "#6366F1"}
        />
      ) : icon ? (
        <Text style={{ fontSize: sz.iconSize, color: v.text }}>{icon}</Text>
      ) : null}
      <Text style={{ color: v.text, fontSize: sz.fontSize, fontWeight: "600", letterSpacing: 0.1 }}>
        {label}
      </Text>
    </Pressable>
  );
}
