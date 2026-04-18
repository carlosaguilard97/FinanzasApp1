import { View, Text, TextInput, TextInputProps, StyleSheet } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : styles.inputNormal]}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <View style={styles.feedbackRow}>
          <Text style={styles.errorIcon}>✕</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {hint && !error && (
        <Text style={styles.hint}>{hint}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:     { marginBottom: 20 },
  label:       { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input: {
    borderWidth:   1,
    borderRadius:  12,
    paddingVertical:   13,
    paddingHorizontal: 16,
    fontSize:      15,
    color:         "#111827",
    backgroundColor: "#F9FAFB",
  },
  inputNormal: { borderColor: "#D1D5DB" },
  inputError:  { borderColor: "#EF4444", backgroundColor: "#FEF2F2" },
  feedbackRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  errorIcon:   { fontSize: 11, color: "#EF4444", fontWeight: "700" },
  errorText:   { fontSize: 12, color: "#EF4444" },
  hint:        { fontSize: 12, color: "#6B7280", marginTop: 6 },
});
