import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";

// En web usamos un input HTML nativo
// En móvil usamos @react-native-community/datetimepicker
let RNDateTimePicker: any = null;
if (Platform.OS !== "web") {
  RNDateTimePicker = require("@react-native-community/datetimepicker").default;
}

interface DatePickerProps {
  label?: string;
  value: string;        // ISO date string: "YYYY-MM-DD"
  onChange: (date: string) => void;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

export function DatePicker({
  label,
  value,
  onChange,
  error,
  minimumDate,
  maximumDate,
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const dateValue = value ? new Date(value + "T12:00:00") : new Date();

  const toISO = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const formatted = value
    ? new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "long", year: "numeric" }).format(dateValue)
    : "Seleccionar fecha";

  // ── WEB ──────────────────────────────────────────────────────────────────
  if (Platform.OS === "web") {
    return (
      <View style={styles.wrapper}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.webInputWrap, error ? styles.inputError : styles.inputNormal]}>
          <Text style={styles.calIcon}>📅</Text>
          {/* Input HTML nativo — soporta el date picker del navegador */}
          <input
            type="date"
            value={value}
            min={minimumDate ? toISO(minimumDate) : undefined}
            max={maximumDate ? toISO(maximumDate) : undefined}
            onChange={(e) => onChange(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 15,
              color: value ? "#111827" : "#9CA3AF",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          />
        </View>
        {error && (
          <View style={styles.feedbackRow}>
            <Text style={styles.errorIcon}>✕</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    );
  }

  // ── MÓVIL / TABLET ────────────────────────────────────────────────────────
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        onPress={() => setShowPicker(true)}
        style={({ pressed }) => [
          styles.mobileBtn,
          error ? styles.inputError : styles.inputNormal,
          { opacity: pressed ? 0.75 : 1 },
        ]}
      >
        <Text style={styles.calIcon}>📅</Text>
        <Text style={[styles.mobileBtnText, !value && styles.placeholder]}>
          {formatted}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </Pressable>

      {error && (
        <View style={styles.feedbackRow}>
          <Text style={styles.errorIcon}>✕</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {showPicker && RNDateTimePicker && (
        <RNDateTimePicker
          value={dateValue}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={(_: unknown, selected?: Date) => {
            setShowPicker(Platform.OS === "ios"); // en Android se cierra solo
            if (selected) onChange(toISO(selected));
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:    { marginBottom: 20 },
  label:      { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 6 },

  webInputWrap: {
    flexDirection:    "row",
    alignItems:       "center",
    gap:              10,
    borderWidth:      1,
    borderRadius:     12,
    paddingVertical:  13,
    paddingHorizontal: 16,
    backgroundColor:  "#F9FAFB",
  },
  mobileBtn: {
    flexDirection:    "row",
    alignItems:       "center",
    gap:              10,
    borderWidth:      1,
    borderRadius:     12,
    paddingVertical:  13,
    paddingHorizontal: 16,
    backgroundColor:  "#F9FAFB",
  },
  inputNormal: { borderColor: "#D1D5DB" },
  inputError:  { borderColor: "#EF4444", backgroundColor: "#FEF2F2" },

  calIcon:       { fontSize: 18 },
  mobileBtnText: { flex: 1, fontSize: 15, color: "#111827" },
  placeholder:   { color: "#9CA3AF" },
  chevron:       { fontSize: 20, color: "#9CA3AF", fontWeight: "300" },

  feedbackRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  errorIcon:   { fontSize: 11, color: "#EF4444", fontWeight: "700" },
  errorText:   { fontSize: 12, color: "#EF4444" },
});
