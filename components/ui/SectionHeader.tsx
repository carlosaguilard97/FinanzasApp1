import { View, Text, Pressable, StyleSheet } from "react-native";

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action && (
        <Pressable onPress={action.onPress} style={styles.actionBtn} hitSlop={8}>
          <Text style={styles.actionLabel}>{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   12,
  },
  title:       { fontSize: 16, fontWeight: "700", color: "#111827" },
  actionBtn:   { paddingVertical: 4, paddingHorizontal: 8 },
  actionLabel: { fontSize: 13, fontWeight: "600", color: "#6366F1" },
});
