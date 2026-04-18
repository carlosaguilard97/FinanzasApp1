import { useRef } from "react";
import { Platform, View, Text, Pressable, StyleSheet } from "react-native";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete: () => void;
}

/**
 * En web: renderiza los children tal cual (sin swipe).
 * En móvil: envuelve con swipe-to-delete hacia la izquierda.
 */
export function SwipeableRow({ children, onDelete }: SwipeableRowProps) {
  const swipeRef = useRef<SwipeableMethods>(null);

  if (Platform.OS === "web") {
    return <>{children}</>;
  }

  const renderRightAction = () => (
    <Pressable
      onPress={() => {
        swipeRef.current?.close();
        onDelete();
      }}
      style={styles.deleteAction}
    >
      <Text style={styles.deleteIcon}>🗑️</Text>
      <Text style={styles.deleteLabel}>Eliminar</Text>
    </Pressable>
  );

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        ref={swipeRef}
        friction={2}
        rightThreshold={60}
        renderRightActions={renderRightAction}
        overshootRight={false}
      >
        {children}
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    backgroundColor: "#EF4444",
    justifyContent:  "center",
    alignItems:      "center",
    width:           80,
    borderRadius:    16,
    marginLeft:      8,
    gap:             4,
  },
  deleteIcon:  { fontSize: 20 },
  deleteLabel: { fontSize: 11, fontWeight: "700", color: "#FFFFFF" },
});
