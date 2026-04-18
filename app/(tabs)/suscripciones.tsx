import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSuscripciones, useToggleSuscripcion, useEliminarSuscripcion } from "../../hooks/useSuscripciones";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { FAB } from "../../components/ui/FAB";
import { HeroHeader } from "../../components/ui/HeroHeader";
import { Toast } from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";
import { formatCurrency, formatDate, diasHasta } from "../../lib/utils";
import type { Suscripcion } from "../../types";

const FREQ_LABEL: Record<string, string> = { semanal: "Semanal", mensual: "Mensual", anual: "Anual" };

export default function Suscripciones() {
  const router = useRouter();
  const { data: suscripciones = [], isLoading } = useSuscripciones();
  const toggle   = useToggleSuscripcion();
  const eliminar = useEliminarSuscripcion();
  const [toDelete, setToDelete] = useState<Suscripcion | null>(null);
  const { toast, show, hide }   = useToast();

  const totalMensual = suscripciones.filter((s) => s.activa).reduce((acc, s) => {
    if (s.frecuencia === "mensual") return acc + s.monto;
    if (s.frecuencia === "anual")   return acc + s.monto / 12;
    if (s.frecuencia === "semanal") return acc + s.monto * 4.33;
    return acc;
  }, 0);

  const activas = suscripciones.filter((s) => s.activa).length;

  const handleEliminar = () => {
    if (!toDelete) return;
    eliminar.mutate(toDelete.id, {
      onSuccess: () => { setToDelete(null); show("Suscripción eliminada", "success"); },
      onError:   () => { setToDelete(null); show("No se pudo eliminar", "error"); },
    });
  };

  return (
    <View style={styles.screen}>
      <HeroHeader
        label="Total mensual activo"
        value={formatCurrency(totalMensual)}
        subtitle={`${activas} suscripción${activas !== 1 ? "es" : ""} activa${activas !== 1 ? "s" : ""}`}
      />

      <FlatList
        data={suscripciones}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1 }}
        ListEmptyComponent={
          isLoading ? (
            <Text style={styles.loading}>Cargando...</Text>
          ) : (
            <EmptyState
              emoji="🔄"
              title="Sin suscripciones"
              description="Registra tus servicios recurrentes para saber cuánto gastas al mes."
              action={{ label: "Nueva suscripción", onPress: () => router.push("/modals/nueva-suscripcion") }}
            />
          )
        }
        renderItem={({ item: s }) => {
          const dias    = diasHasta(s.proximo_cobro);
          const urgente = dias <= 3 && s.activa;
          return (
            <Card style={{ opacity: s.activa ? 1 : 0.55 }}>
              {/* Fila principal */}
              <View style={styles.cardRow}>
                <View style={[styles.iconWrap, { backgroundColor: urgente ? "#FFFBEB" : "#EEF2FF" }]}>
                  <Text style={{ fontSize: 22 }}>🔄</Text>
                </View>
                <View style={styles.info}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{s.nombre}</Text>
                    {urgente && (
                      <View style={styles.urgentBadge}>
                        <Text style={styles.urgentText}>
                          {dias === 0 ? "Hoy" : dias === 1 ? "Mañana" : `${dias} días`}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.sub}>{FREQ_LABEL[s.frecuencia]} · {formatDate(s.proximo_cobro)}</Text>
                </View>
                <Text style={styles.amount}>{formatCurrency(s.monto)}</Text>
              </View>

              {/* Separador */}
              <View style={styles.divider} />

              {/* Acciones secundarias */}
              <View style={styles.actionsRow}>
                <Pressable
                  onPress={() => toggle.mutate(s.id)}
                  style={[styles.toggleBtn, { borderColor: s.activa ? "#10B981" : "#D1D5DB", backgroundColor: s.activa ? "#ECFDF5" : "#F9FAFB" }]}
                >
                  <View style={[styles.toggleDot, { backgroundColor: s.activa ? "#10B981" : "#D1D5DB" }]} />
                  <Text style={[styles.toggleText, { color: s.activa ? "#10B981" : "#9CA3AF" }]}>
                    {s.activa ? "Activa" : "Inactiva"}
                  </Text>
                </Pressable>

                <Pressable onPress={() => setToDelete(s)} hitSlop={12} style={styles.deleteBtn}>
                  <Text style={styles.deleteText}>Eliminar</Text>
                </Pressable>
              </View>
            </Card>
          );
        }}
      />

      <FAB onPress={() => router.push("/modals/nueva-suscripcion")} />

      <ConfirmDialog
        visible={!!toDelete}
        title="Eliminar suscripción"
        message={`¿Eliminar "${toDelete?.nombre}"?`}
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleEliminar}
        onCancel={() => setToDelete(null)}
        danger
      />
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onHide={hide} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: "#F9FAFB" },
  loading: { textAlign: "center", marginTop: 40, color: "#9CA3AF", fontSize: 14 },

  cardRow:  { flexDirection: "row", alignItems: "center", gap: 14 },
  iconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  info:     { flex: 1 },
  nameRow:  { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  name:     { fontSize: 15, fontWeight: "700", color: "#111827" },
  sub:      { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  amount:   { fontSize: 16, fontWeight: "700", color: "#111827" },

  urgentBadge: { backgroundColor: "#FFFBEB", borderWidth: 1, borderColor: "#FDE68A", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  urgentText:  { fontSize: 11, fontWeight: "700", color: "#F59E0B" },

  divider:    { height: 1, backgroundColor: "#F3F4F6", marginVertical: 12 },
  actionsRow: { flexDirection: "row", alignItems: "center", gap: 12 },

  toggleBtn:  { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
  toggleDot:  { width: 8, height: 8, borderRadius: 4 },
  toggleText: { fontSize: 13, fontWeight: "600" },

  deleteBtn:  { paddingVertical: 4, paddingHorizontal: 4 },
  deleteText: { fontSize: 12, color: "#D1D5DB" },
});
