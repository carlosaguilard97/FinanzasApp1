import { View, StyleSheet } from "react-native";
import { Button } from "./Button";

interface ModalFooterProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
}

export function ModalFooter({ label, onPress, loading }: ModalFooterProps) {
  return (
    <View style={styles.container}>
      <Button label={label} onPress={onPress} loading={loading} size="lg" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop:        16,
    paddingBottom:     36,
    backgroundColor:   "#FFFFFF",
    borderTopWidth:    1,
    borderTopColor:    "#E5E7EB",
  },
});
