import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useMetas, useEliminarMeta } from "../../hooks/useMetas";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { FAB } from "../../components/ui/FAB";
import { Button } from "../../components/ui/Button";
import { Toast } from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";
import { formatCurrency, formatDate } from "../../lib/utils";
import type { Meta } from "../../types";

export default function Metas() {
  const router = useRouter();
  const { data: metas = [], isLoading } = useMetas();
  const eliminar = useEliminarMeta();
  const [toDelete, setToDelete] = useState<Meta | null>(null);
  const { toast, show, hide }   = useToast();

  const activas     = metas.filter((m) => !m.completada);
  const completadas = metas.filter((m) => m.completada);

  const handleEliminar = () => {
    if (!toDelete) return;
    eliminar.mutate(toDelete.id, {
      onSuccess: () => { setToDelete(null); show("Meta eliminada", "success"); },
      onError:   () => { setToDelete(null); show("No se pudo eliminar", "error"); },
    });
  };

  const MetaCard = ({ meta }: { meta: Meta }) => {
    const pct = Math.min(100, (meta.monto_actual / meta.monto_objetivo) * 100);
    return (
      <Card>
        {/* Cabecera */}
        <View style={styles.metaHeader}>
          <View style={[styles.metaIcon, { backgroundColor: meta.completada ? "#ECFDF5" : "#EEF2FF" }]}>
            <Text style={{ fontSize: 22 }}>{meta.completada ? "✅" : "🎯"}</Text>
          </View>
          <View style={styles.metaInfo}>
            <View style={styles.metaNameRow}>
              <Text style={styles.metaName}>{meta.nombre}</Text>
              {meta.completada && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>Completada</Text>
                </View>
              )}
            </View>
            {meta.fecha_limite && (
              <Text style={styles.metaSub}>Límite: {formatDate(meta.fecha_limite)}</Text>
            )}
          </View>
          <Text style={styles.metaPct}>{pct.toFixed(0)}%</Text>
        </View>

        {/* Barra de progreso */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, {
            width: `${pct}%` as any,
            backgroundColor: meta.completada ? "#10B981" : "#6366F1",
          }]} />
        </View>

        {/* Montos */}
        <View style={styles.metaAmounts}>
          <Text style={styles.metaAmountCurrent}>{formatCurrency(meta.monto_actual)}</Text>
          <Text style={styles.metaAmountTotal}>/ {formatCurrency(meta.monto_objetivo)}</Text>
        </View>

        {/* Acciones */}
        {!meta.completada && (
          <>
            <View style={styles.divider} />
            <View style={styles.metaActions}>
              <Button
                label="+ Aportar"
                variant="ghost"
                size="sm"
                fullWidth={false}
                onPress={() =>
                  router.push({ pathname: "/modals/nueva-meta", params: { aportarId: String(meta.id) } })
                }
              />
              <Pressable onPress={() => setToDelete(meta)} hitSlop={12} style={styles.deleteBtn}>
                <Text style={styles.deleteText}>Eliminar</Text>
              </Pressable>
            </View>
          </>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={[...activas, ...completadas]}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1 }}
        ListHeaderComponent={
          metas.length > 0 ? (
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Activas</Text>
                <Text style={styles.statValue}>{activas.length}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Completadas</Text>
                <Text style={[styles.statValue, { color: "#10B981" }]}>{completadas.length}</Text>
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          isLoading ? (
            <Text style={styles.loading}>Cargando...</Text>
          ) : (
            <EmptyState
              emoji="🎯"
              title="Sin metas"
              description="Define un objetivo de ahorro y empieza a aportar hacia él."
              action={{ label: "Nueva meta", onPress: () => router.push("/modals/nueva-meta") }}
            />
          )
        }
        renderItem={({ item }) => <MetaCard meta={item} />}
      />

      <FAB onPress={() => router.push("/modals/nueva-meta")} />

      <ConfirmDialog
        visible={!!toDelete}
        title="Eliminar meta"
        message={`¿Eliminar "${toDelete?.nombre}"? Se perderá el historial de aportaciones.`}
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

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 6 },
  statCard: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#E5E7EB", padding: 14 },
  statLabel:{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 },
  statValue:{ fontSize: 26, fontWeight: "800", color: "#111827" },

  metaHeader:  { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14 },
  metaIcon:    { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  metaInfo:    { flex: 1 },
  metaNameRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  metaName:    { fontSize: 15, fontWeight: "700", color: "#111827" },
  metaSub:     { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  metaPct:     { fontSize: 14, fontWeight: "700", color: "#6366F1" },

  completedBadge: { backgroundColor: "#ECFDF5", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  completedText:  { fontSize: 11, fontWeight: "700", color: "#10B981" },

  progressBg:   { height: 10, backgroundColor: "#F3F4F6", borderRadius: 5, marginBottom: 10 },
  progressFill: { height: 10, borderRadius: 5 },

  metaAmounts:       { flexDirection: "row", alignItems: "baseline", gap: 4 },
  metaAmountCurrent: { fontSize: 14, fontWeight: "700", color: "#374151" },
  metaAmountTotal:   { fontSize: 13, color: "#9CA3AF" },

  divider:     { height: 1, backgroundColor: "#F3F4F6", marginVertical: 12 },
  metaActions: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  deleteBtn:   { paddingVertical: 4, paddingHorizontal: 4 },
  deleteText:  { fontSize: 12, color: "#D1D5DB" },
});
