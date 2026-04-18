import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { Button } from "./Button";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel  = "Cancelar",
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.iconWrap, { backgroundColor: danger ? "#FEF2F2" : "#EEF2FF" }]}>
            <Text style={styles.iconText}>{danger ? "🗑️" : "❓"}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Button
              label={confirmLabel}
              onPress={onConfirm}
              variant={danger ? "danger" : "primary"}
              size="md"
            />
            <View style={styles.spacer} />
            <Button
              label={cancelLabel}
              onPress={onCancel}
              variant="secondary"
              size="md"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex:            1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems:      "center",
    justifyContent:  "center",
    paddingHorizontal: 24,
  },
  dialog: {
    backgroundColor: "#FFFFFF",
    borderRadius:    24,
    padding:         28,
    width:           "100%",
    alignItems:      "center",
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 8 },
    shadowOpacity:   0.15,
    shadowRadius:    20,
    elevation:       12,
  },
  iconWrap: {
    width:         64,
    height:        64,
    borderRadius:  32,
    alignItems:    "center",
    justifyContent:"center",
    marginBottom:  16,
  },
  iconText:  { fontSize: 28 },
  title: {
    fontSize:     18,
    fontWeight:   "700",
    color:        "#111827",
    textAlign:    "center",
    marginBottom: 8,
  },
  message: {
    fontSize:     14,
    color:        "#6B7280",
    textAlign:    "center",
    lineHeight:   21,
    marginBottom: 24,
  },
  actions: { width: "100%" },
  spacer:  { height: 10 },
});
