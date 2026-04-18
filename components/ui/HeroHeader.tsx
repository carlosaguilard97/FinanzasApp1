import { View, Text, StyleSheet } from "react-native";

interface HeroHeaderProps {
  label: string;
  value: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function HeroHeader({ label, value, subtitle, children }: HeroHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children && <View style={styles.childrenWrap}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 24,
    paddingTop:        48,
    paddingBottom:     32,
  },
  label:    { fontSize: 13, fontWeight: "500", color: "rgba(255,255,255,0.7)", marginBottom: 4 },
  value:    { fontSize: 38, fontWeight: "800", color: "#FFFFFF", letterSpacing: -0.5 },
  subtitle: { fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 },
  childrenWrap: { marginTop: 20 },
});
