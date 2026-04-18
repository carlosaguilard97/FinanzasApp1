import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useCuentas, useEliminarCuenta } from "../../hooks/useCuentas";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { FAB } from "../../components/ui/FAB";
import { HeroHeader } from "../../components/ui/HeroHeader";
import { Toast } from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";
import { formatCurrency } from "../../lib/utils";
import type { Cuenta } from "../../types";

const TIPO_LABEL: Record<string, string> = {
  efectivo: "Efectivo", banco: "Banco", debito: "Débito",
  credito: "Crédito", inversion: "Inversión", otro: "Otro",
};
const TIPO_EMOJI: Record<string, string> = {
  efectivo: "💵", banco: "🏦", debito: "💳",
  credito: "💳", inversion: "📈", otro: "🪙",
};

export default function Cuentas() {
  const router = useRouter();
  const { data: cuentas = [], isLoading } = useCuentas();
  const eliminar = useEliminarCuenta();
  const [toDelete, setToDelete] = useState<Cuenta | null>(null);
  const { toast, show, hide }   = useToast();

  const balanceTotal = cuentas.reduce((acc, c) => acc + c.saldo_actual, 0);

  const handleEliminar = () => {
    if (!toDelete) return;
    eliminar.mutate(toDelete.id, {
      onSuccess: () => { setToDelete(null); show("Cuenta eliminada", "success"); },
      onError:   (e) => { setToDelete(null); show(e.message, "error"); },
    });
  };

  return (
    <View style={styles.screen}>
      <HeroHeader
        label="Balance total"
        value={formatCurrency(balanceTotal)}
        subtitle={`${cuentas.length} cuenta${cuentas.length !== 1 ? "s" : ""}`}
      />

      <FlatList
        data={cuentas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1 }}
        ListEmptyComponent={
          isLoading ? (
            <Text style={styles.loading}>Cargando...</Text>
          ) : (
            <EmptyState
              emoji="🏦"
              title="Sin cuentas"
              description="Agrega tu primera cuenta para empezar a registrar movimientos."
              action={{ label: "Nueva cuenta", onPress: () => router.push("/modals/nueva-cuenta") }}
            />
          )
        }
        renderItem={({ item: c }) => (
          <Card>
            <View style={styles.row}>
              <View style={styles.iconWrap}>
                <Text style={{ fontSize: 22 }}>{TIPO_EMOJI[c.tipo]}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{c.nombre}</Text>
                <Text style={styles.sub}>{TIPO_LABEL[c.tipo]} · {c.moneda}</Text>
              </View>
              <View style={styles.right}>
                <Text style={[styles.balance, { color: c.saldo_actual >= 0 ? "#111827" : "#EF4444" }]}>
                  {formatCurrency(c.saldo_actual)}
                </Text>
                <Pressable onPress={() => setToDelete(c)} hitSlop={12} style={styles.deleteBtn}>
                  <Text style={styles.deleteText}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          </Card>
        )}
      />

      <FAB onPress={() => router.push("/modals/nueva-cuenta")} />

      <ConfirmDialog
        visible={!!toDelete}
        title="Eliminar cuenta"
        message={`¿Eliminar "${toDelete?.nombre}"? Solo es posible si no tiene movimientos registrados.`}
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
  row:     { flexDirection: "row", alignItems: "center", gap: 14 },
  iconWrap:{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center" },
  info:    { flex: 1 },
  name:    { fontSize: 15, fontWeight: "700", color: "#111827" },
  sub:     { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  right:   { alignItems: "flex-end", gap: 4 },
  balance: { fontSize: 16, fontWeight: "700" },
  deleteBtn:  { paddingVertical: 2 },
  deleteText: { fontSize: 11, color: "#D1D5DB" },
});
