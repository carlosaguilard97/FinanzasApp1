import { useRef } from "react";
import { Platform, Text, Pressable, StyleSheet, Animated } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete: () => void;
}

export function SwipeableRow({ children, onDelete }: SwipeableRowProps) {
  const swipeRef = useRef<Swipeable>(null);

  if (Platform.OS === "web") {
    return <>{children}</>;
  }

  const renderRightAction = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.5],
      extrapolate: "clamp",
    });

    return (
      <Pressable
        onPress={() => {
          swipeRef.current?.close();
          onDelete();
        }}
        style={styles.deleteAction}
      >
        <Animated.Text style={[styles.deleteIcon, { transform: [{ scale }] }]}>
          🗑️
        </Animated.Text>
        <Text style={styles.deleteLabel}>Eliminar</Text>
      </Pressable>
    );
  };

  return (
    <Swipeable
      ref={swipeRef}
      friction={2}
      rightThreshold={40}
      renderRightActions={renderRightAction}
      overshootRight={false}
    >
      {children}
    </Swipeable>
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
