import { Pressable, Text, StyleSheet } from "react-native";

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Text style={styles.icon}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position:        "absolute",
    bottom:          28,
    right:           20,
    width:           56,
    height:          56,
    borderRadius:    28,
    backgroundColor: "#6366F1",
    alignItems:      "center",
    justifyContent:  "center",
    shadowColor:     "#6366F1",
    shadowOffset:    { width: 0, height: 6 },
    shadowOpacity:   0.4,
    shadowRadius:    10,
    elevation:       8,
  },
  icon: {
    color:      "#FFFFFF",
    fontSize:   30,
    lineHeight: 34,
    fontWeight: "300",
  },
});
