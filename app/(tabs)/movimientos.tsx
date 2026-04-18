import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useMovimientos, useEliminarMovimiento, type MovimientosFiltros } from "../../hooks/useMovimientos";
import { useCuentas } from "../../hooks/useCuentas";
import { EmptyState } from "../../components/ui/EmptyState";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { FAB } from "../../components/ui/FAB";
import { Toast } from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";
import { formatCurrency, formatDate } from "../../lib/utils";
import type { Movimiento } from "../../types";

export default function Movimientos() {
  const router = useRouter();
  const [filtros, setFiltros]   = useState<MovimientosFiltros>({ page: 1, limit: 20 });
  const [toDelete, setToDelete] = useState<Movimiento | null>(null);
  const { toast, show, hide }   = useToast();

  const { data, isLoading }      = useMovimientos(filtros);
  const { data: cuentas = [] }   = useCuentas();
  const eliminar = useEliminarMovimiento();
  const movimientos = data?.data ?? [];

  const handleEliminar = () => {
    if (!toDelete) return;
    eliminar.mutate(toDelete.id, {
      onSuccess: () => { setToDelete(null); show("Movimiento eliminado", "success"); },
      onError:   () => { setToDelete(null); show("No se pudo eliminar", "error"); },
    });
  };

  const setCuenta = (id: number | null) =>
    setFiltros((f) => ({ ...f, cuentaId: id ?? undefined, page: 1 }));

  const setTipo = (v: string | number | null) =>
    setFiltros((f) => ({ ...f, tipo: (v as "ingreso" | "gasto") ?? undefined, page: 1 }));

  return (
    <View style={styles.screen}>
      {/* Barra de filtros */}
      <View style={styles.filterBar}>

        {/* Filtro principal: cuentas */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <Pressable
            onPress={() => setCuenta(null)}
            style={[styles.chip, !filtros.cuentaId && styles.chipActive]}
          >
            <Text style={[styles.chipText, !filtros.cuentaId && styles.chipTextActive]}>
              Todas
            </Text>
          </Pressable>
          {cuentas.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setCuenta(filtros.cuentaId === c.id ? null : c.id)}
              style={[styles.chip, filtros.cuentaId === c.id && styles.chipActive]}
            >
              <Text style={[styles.chipText, filtros.cuentaId === c.id && styles.chipTextActive]}>
                {c.nombre}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Separador */}
        <View style={styles.filterDivider} />

        {/* Filtro secundario: tipo */}
        <View style={styles.filterRow}>
          {([
            { value: null,      label: "Todos" },
            { value: "ingreso", label: "💰 Ingresos" },
            { value: "gasto",   label: "💸 Gastos" },
          ] as const).map((opt) => {
            const active = (filtros.tipo ?? null) === opt.value;
            return (
              <Pressable
                key={String(opt.value)}
                onPress={() => setTipo(opt.value)}
                style={[styles.chipSm, active && styles.chipSmActive]}
              >
                <Text style={[styles.chipSmText, active && styles.chipSmTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={movimientos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, gap: 2, flexGrow: 1 }}
        ListEmptyComponent={
          isLoading ? (
            <Text style={styles.loading}>Cargando...</Text>
          ) : (
            <EmptyState
              title="Sin movimientos"
              description="Registra tu primer ingreso o gasto para empezar a llevar el control."
              action={{ label: "Nuevo movimiento", onPress: () => router.push("/modals/nuevo-movimiento") }}
            />
          )
        }
        renderItem={({ item: m, index }) => {
          const isFirst = index === 0;
          const isLast  = index === movimientos.length - 1;
          return (
            <View style={[
              styles.row,
              isFirst && styles.rowFirst,
              isLast  && styles.rowLast,
              !isFirst && styles.rowBorderTop,
            ]}>
              <View style={[styles.dot, { backgroundColor: m.categoria.color + "22" }]}>
                <View style={[styles.dotInner, { backgroundColor: m.categoria.color }]} />
              </View>
              <View style={styles.info}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {m.descripcion || m.categoria.nombre}
                </Text>
                <Text style={styles.rowSub}>{formatDate(m.fecha)} · {m.cuenta.nombre}</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={[styles.amount, { color: m.tipo === "ingreso" ? "#10B981" : "#EF4444" }]}>
                  {m.tipo === "ingreso" ? "+" : "-"}{formatCurrency(m.monto)}
                </Text>
                <Pressable onPress={() => setToDelete(m)} hitSlop={12} style={styles.deleteBtn}>
                  <Text style={styles.deleteText}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />

      <FAB onPress={() => router.push("/modals/nuevo-movimiento")} />

      <ConfirmDialog
        visible={!!toDelete}
        title="Eliminar movimiento"
        message={`¿Eliminar "${toDelete?.descripcion || toDelete?.categoria?.nombre}"? Esta acción no se puede deshacer.`}
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
  screen:    { flex: 1, backgroundColor: "#F9FAFB" },
  loading:   { textAlign: "center", marginTop: 40, color: "#9CA3AF", fontSize: 14 },

  filterBar: {
    backgroundColor:  "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingTop:       12,
    paddingBottom:    12,
  },
  filterRow: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            8,
    paddingHorizontal: 16,
  },
  filterDivider: {
    height:          1,
    backgroundColor: "#F3F4F6",
    marginVertical:  10,
    marginHorizontal: 16,
  },

  // Chips principales (cuentas) — tamaño completo
  chip: {
    paddingVertical:   9,
    paddingHorizontal: 16,
    borderRadius:      10,
    borderWidth:       1.5,
    borderColor:       "#D1D5DB",
    backgroundColor:   "#FFFFFF",
  },
  chipActive: {
    borderColor:     "#6366F1",
    backgroundColor: "#6366F1",
  },
  chipText:       { fontSize: 14, fontWeight: "500", color: "#374151" },
  chipTextActive: { color: "#FFFFFF" },

  // Chips secundarios (tipo) — más pequeños
  chipSm: {
    paddingVertical:   7,
    paddingHorizontal: 14,
    borderRadius:      8,
    borderWidth:       1,
    borderColor:       "#E5E7EB",
    backgroundColor:   "#F9FAFB",
  },
  chipSmActive: {
    borderColor:     "#6366F1",
    backgroundColor: "#EEF2FF",
  },
  chipSmText:       { fontSize: 13, fontWeight: "500", color: "#6B7280" },
  chipSmTextActive: { color: "#6366F1", fontWeight: "600" },

  row: {
    backgroundColor:   "#FFFFFF",
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 16,
    paddingVertical:   14,
    gap:               12,
    borderLeftWidth:   1,
    borderRightWidth:  1,
    borderColor:       "#E5E7EB",
  },
  rowFirst:     { borderTopWidth: 1, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  rowLast:      { borderBottomWidth: 1, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  rowBorderTop: { borderTopWidth: 1, borderTopColor: "#F3F4F6" },

  dot:      { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  dotInner: { width: 12, height: 12, borderRadius: 6 },
  info:     { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: "600", color: "#111827" },
  rowSub:   { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  rowRight: { alignItems: "flex-end", gap: 4 },
  amount:   { fontSize: 14, fontWeight: "700" },
  deleteBtn:  { paddingVertical: 2 },
  deleteText: { fontSize: 11, color: "#D1D5DB" },
});
