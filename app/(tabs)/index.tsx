import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useCuentas } from "../../hooks/useCuentas";
import { useResumenDashboard, useMovimientos } from "../../hooks/useMovimientos";
import { useSuscripciones } from "../../hooks/useSuscripciones";
import { useMetas } from "../../hooks/useMetas";
import { Card } from "../../components/ui/Card";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { HeroHeader } from "../../components/ui/HeroHeader";
import { formatCurrency, formatDate, diasHasta } from "../../lib/utils";

export default function Dashboard() {
  const router = useRouter();
  const { data: cuentas = [] }        = useCuentas();
  const { data: resumen }             = useResumenDashboard();
  const { data: movimientosData }     = useMovimientos({ limit: 5 });
  const { data: suscripciones = [] }  = useSuscripciones();
  const { data: metas = [] }          = useMetas();

  const balanceTotal   = cuentas.reduce((acc, c) => acc + c.saldo_actual, 0);
  const proximasSubs   = suscripciones.filter((s) => s.activa && diasHasta(s.proximo_cobro) <= 7);
  const metasActivas   = metas.filter((m) => !m.completada);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>

      {/* Hero */}
      <HeroHeader
        label="Balance total"
        value={formatCurrency(balanceTotal)}
        subtitle={`${cuentas.length} cuenta${cuentas.length !== 1 ? "s" : ""}`}
      >
        <View style={styles.heroRow}>
          <View style={styles.heroTile}>
            <Text style={styles.heroTileLabel}>Ingresos del mes</Text>
            <Text style={styles.heroTileValue}>{formatCurrency(resumen?.ingresos ?? 0)}</Text>
          </View>
          <View style={styles.heroTile}>
            <Text style={styles.heroTileLabel}>Gastos del mes</Text>
            <Text style={styles.heroTileValue}>{formatCurrency(resumen?.gastos ?? 0)}</Text>
          </View>
        </View>
      </HeroHeader>

      <View style={styles.body}>
        {/* CTA principal */}
        <Pressable
          onPress={() => router.push("/modals/nuevo-movimiento")}
          style={({ pressed }) => [styles.ctaBtn, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.ctaBtnText}>+ Registrar movimiento</Text>
        </Pressable>

        {/* Ahorro neto */}
        {resumen && (
          <Card style={styles.ahorroCard}>
            <View>
              <Text style={styles.ahorroLabel}>Ahorro neto del mes</Text>
              <Text style={[styles.ahorroValue, { color: resumen.ahorro >= 0 ? "#10B981" : "#EF4444" }]}>
                {formatCurrency(resumen.ahorro)}
              </Text>
            </View>
            <View style={[styles.ahorroIcon, { backgroundColor: resumen.ahorro >= 0 ? "#ECFDF5" : "#FEF2F2" }]}>
              <Text style={{ fontSize: 24 }}>{resumen.ahorro >= 0 ? "📈" : "📉"}</Text>
            </View>
          </Card>
        )}

        {/* Últimos movimientos */}
        <View style={styles.section}>
          <SectionHeader
            title="Últimos movimientos"
            action={{ label: "Ver todos", onPress: () => router.push("/(tabs)/movimientos") }}
          />
          {!movimientosData?.data.length ? (
            <Text style={styles.emptyText}>Sin movimientos aún</Text>
          ) : (
            <Card padding={0}>
              {movimientosData.data.map((m, i) => (
                <View key={m.id}>
                  <View style={styles.movRow}>
                    <View style={[styles.movDot, { backgroundColor: m.categoria.color + "22" }]}>
                      <View style={[styles.movDotInner, { backgroundColor: m.categoria.color }]} />
                    </View>
                    <View style={styles.movInfo}>
                      <Text style={styles.movTitle} numberOfLines={1}>
                        {m.descripcion || m.categoria.nombre}
                      </Text>
                      <Text style={styles.movSub}>{formatDate(m.fecha)} · {m.cuenta.nombre}</Text>
                    </View>
                    <Text style={[styles.movAmount, { color: m.tipo === "ingreso" ? "#10B981" : "#EF4444" }]}>
                      {m.tipo === "ingreso" ? "+" : "-"}{formatCurrency(m.monto)}
                    </Text>
                  </View>
                  {i < movimientosData.data.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </Card>
          )}
        </View>

        {/* Próximos cobros */}
        {proximasSubs.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Próximos cobros" />
            <Card padding={0}>
              {proximasSubs.map((s, i) => {
                const dias = diasHasta(s.proximo_cobro);
                return (
                  <View key={s.id}>
                    <View style={styles.movRow}>
                      <View style={[styles.movDot, { backgroundColor: "#FFFBEB" }]}>
                        <Text style={{ fontSize: 14 }}>🔔</Text>
                      </View>
                      <View style={styles.movInfo}>
                        <Text style={styles.movTitle}>{s.nombre}</Text>
                        <Text style={[styles.movSub, { color: "#F59E0B", fontWeight: "600" }]}>
                          {dias === 0 ? "Hoy" : dias === 1 ? "Mañana" : `En ${dias} días`}
                        </Text>
                      </View>
                      <Text style={styles.movAmountNeutral}>{formatCurrency(s.monto)}</Text>
                    </View>
                    {i < proximasSubs.length - 1 && <View style={styles.divider} />}
                  </View>
                );
              })}
            </Card>
          </View>
        )}

        {/* Metas */}
        {metasActivas.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Metas de ahorro"
              action={{ label: "Ver todas", onPress: () => router.push("/(tabs)/metas") }}
            />
            <View style={{ gap: 10 }}>
              {metasActivas.slice(0, 3).map((meta) => {
                const pct = Math.min(100, (meta.monto_actual / meta.monto_objetivo) * 100);
                return (
                  <Card key={meta.id}>
                    <View style={styles.metaHeader}>
                      <Text style={styles.metaName}>{meta.nombre}</Text>
                      <Text style={styles.metaPct}>{pct.toFixed(0)}%</Text>
                    </View>
                    <View style={styles.progressBg}>
                      <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
                    </View>
                    <Text style={styles.metaSub}>
                      {formatCurrency(meta.monto_actual)} de {formatCurrency(meta.monto_objetivo)}
                    </Text>
                  </Card>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: "#F9FAFB" },
  content: { paddingBottom: 40 },
  body:    { padding: 20, gap: 8 },

  heroRow:       { flexDirection: "row", gap: 12 },
  heroTile:      { flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, padding: 14 },
  heroTileLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4 },
  heroTileValue: { fontSize: 17, fontWeight: "700", color: "#FFFFFF" },

  ctaBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth:     1,
    borderColor:     "#D1D5DB",
    borderRadius:    16,
    paddingVertical: 16,
    alignItems:      "center",
    marginBottom:    8,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.06,
    shadowRadius:    4,
    elevation:       2,
  },
  ctaBtnText: { fontSize: 15, fontWeight: "700", color: "#6366F1" },

  ahorroCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  ahorroLabel: { fontSize: 12, color: "#6B7280", fontWeight: "500", marginBottom: 4 },
  ahorroValue: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  ahorroIcon:  { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },

  section:   { marginTop: 16 },
  emptyText: { fontSize: 14, color: "#9CA3AF", textAlign: "center", paddingVertical: 24 },

  movRow:        { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  movDot:        { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  movDotInner:   { width: 12, height: 12, borderRadius: 6 },
  movInfo:       { flex: 1 },
  movTitle:      { fontSize: 14, fontWeight: "600", color: "#111827" },
  movSub:        { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  movAmount:     { fontSize: 14, fontWeight: "700" },
  movAmountNeutral: { fontSize: 14, fontWeight: "700", color: "#111827" },
  divider:       { height: 1, backgroundColor: "#F3F4F6", marginHorizontal: 16 },

  metaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  metaName:   { fontSize: 14, fontWeight: "600", color: "#111827", flex: 1 },
  metaPct:    { fontSize: 13, fontWeight: "700", color: "#6366F1" },
  progressBg: { height: 8, backgroundColor: "#F3F4F6", borderRadius: 4, marginBottom: 8 },
  progressFill: { height: 8, backgroundColor: "#6366F1", borderRadius: 4 },
  metaSub:    { fontSize: 12, color: "#9CA3AF" },
});
