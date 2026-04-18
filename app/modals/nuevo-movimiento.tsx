import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCuentas } from "../../hooks/useCuentas";
import { useCategorias } from "../../hooks/useCategorias";
import { useCrearMovimiento } from "../../hooks/useMovimientos";
import { Input } from "../../components/ui/Input";
import { DatePicker } from "../../components/ui/DatePicker";
import { ChipSelector } from "../../components/ui/ChipSelector";
import { ModalFooter } from "../../components/ui/ModalFooter";
import { Toast } from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";
import { useGoBack, todayISO } from "../../lib/utils";

const schema = z.object({
  tipo:        z.enum(["ingreso", "gasto"]),
  monto:       z.string().min(1, "Ingresa un monto").refine((v) => Number(v) > 0, "Debe ser mayor a 0"),
  cuentaId:    z.number({ required_error: "Selecciona una cuenta" }),
  categoriaId: z.number({ required_error: "Selecciona una categoría" }),
  fecha:       z.string().min(1, "La fecha es requerida"),
  descripcion: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NuevoMovimiento() {
  const goBack = useGoBack();
  const { data: cuentas = [] } = useCuentas();
  const crear = useCrearMovimiento();
  const { toast, show, hide } = useToast();

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: "gasto", monto: "", descripcion: "", fecha: todayISO() },
  });

  const tipo = watch("tipo");
  const { data: categorias = [] } = useCategorias(tipo);

  const onSubmit = (data: FormData) => {
    crear.mutate(
      {
        tipo:        data.tipo,
        monto:       Number(data.monto),
        fecha:       data.fecha,
        cuentaId:    data.cuentaId,
        categoriaId: data.categoriaId,
        descripcion: data.descripcion,
      },
      {
        onSuccess: () => goBack(),
        onError:   (e) => show(e.message, "error"),
      }
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Selector tipo — decisión visual principal */}
        <Controller
          control={control}
          name="tipo"
          render={({ field: { value, onChange } }) => (
            <View style={styles.tipoRow}>
              {(["gasto", "ingreso"] as const).map((t) => {
                const sel    = value === t;
                const isGasto = t === "gasto";
                return (
                  <Pressable
                    key={t}
                    onPress={() => onChange(t)}
                    style={({ pressed }) => ({
                      flex:            1,
                      alignItems:      "center",
                      paddingVertical: 18,
                      borderRadius:    16,
                      borderWidth:     2,
                      borderColor:     sel ? (isGasto ? "#EF4444" : "#10B981") : "#E5E7EB",
                      backgroundColor: sel ? (isGasto ? "#FEF2F2" : "#ECFDF5") : "#F9FAFB",
                      opacity:         pressed ? 0.8 : 1,
                    })}
                  >
                    <Text style={{ fontSize: 32, marginBottom: 6 }}>{isGasto ? "💸" : "💰"}</Text>
                    <Text style={{
                      fontSize:   14,
                      fontWeight: "700",
                      color:      sel ? (isGasto ? "#EF4444" : "#10B981") : "#9CA3AF",
                    }}>
                      {isGasto ? "Gasto" : "Ingreso"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        />

        <Controller control={control} name="monto" render={({ field: { value, onChange } }) => (
          <Input label="Monto" keyboardType="decimal-pad" placeholder="0.00" value={value} onChangeText={onChange} error={errors.monto?.message} />
        )} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Cuenta</Text>
          <Controller control={control} name="cuentaId" render={({ field: { value, onChange } }) => (
            <ChipSelector options={cuentas.map((c) => ({ value: c.id, label: c.nombre }))} value={value} onChange={(v) => onChange(v)} />
          )} />
          {errors.cuentaId && <Text style={styles.fieldError}>✕ {errors.cuentaId.message}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Categoría</Text>
          <Controller control={control} name="categoriaId" render={({ field: { value, onChange } }) => (
            <ChipSelector options={categorias.map((c) => ({ value: c.id, label: c.nombre, color: c.color }))} value={value} onChange={(v) => onChange(v)} />
          )} />
          {errors.categoriaId && <Text style={styles.fieldError}>✕ {errors.categoriaId.message}</Text>}
        </View>

        <Controller control={control} name="fecha" render={({ field: { value, onChange } }) => (
          <DatePicker label="Fecha" value={value} onChange={onChange} error={errors.fecha?.message} maximumDate={new Date()} />
        )} />

        <Controller control={control} name="descripcion" render={({ field: { value, onChange } }) => (
          <Input label="Descripción (opcional)" placeholder="Ej. Comida en restaurante" value={value} onChangeText={onChange} />
        )} />
      </ScrollView>

      <ModalFooter label="Guardar movimiento" onPress={handleSubmit(onSubmit)} loading={crear.isPending} />
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onHide={hide} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: "#FFFFFF" },
  scroll:     { padding: 20, paddingBottom: 16 },
  tipoRow:    { flexDirection: "row", gap: 12, marginBottom: 24 },
  fieldGroup: { marginBottom: 20 },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  fieldError: { fontSize: 12, color: "#EF4444", marginTop: 6 },
});
