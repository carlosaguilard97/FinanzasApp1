import { View, Text, StyleSheet } from "react-native";
import { Button } from "./Button";

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ emoji = "💸", title, description, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {action && (
        <View style={styles.actionWrap}>
          <Button
            label={action.label}
            onPress={action.onPress}
            fullWidth={false}
            size="md"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
    paddingVertical:  64,
    paddingHorizontal: 32,
  },
  iconWrap: {
    width:          80,
    height:         80,
    borderRadius:   40,
    backgroundColor:"#F3F4F6",
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   20,
  },
  emoji:       { fontSize: 36 },
  title: {
    fontSize:     18,
    fontWeight:   "700",
    color:        "#111827",
    textAlign:    "center",
    marginBottom: 8,
  },
  description: {
    fontSize:     14,
    color:        "#6B7280",
    textAlign:    "center",
    lineHeight:   21,
    marginBottom: 28,
  },
  actionWrap: { marginTop: 4 },
});
