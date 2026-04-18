import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCrearMeta, useAportarMeta } from "../../hooks/useMetas";
import { useCuentas } from "../../hooks/useCuentas";
import { Input } from "../../components/ui/Input";
import { DatePicker } from "../../components/ui/DatePicker";
import { ChipSelector } from "../../components/ui/ChipSelector";
import { ModalFooter } from "../../components/ui/ModalFooter";
import { Toast } from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";
import { useGoBack, todayISO } from "../../lib/utils";

const metaSchema = z.object({
  nombre:         z.string().min(1, "El nombre es requerido"),
  monto_objetivo: z.string().min(1).refine((v) => Number(v) > 0, "Debe ser mayor a 0"),
  fecha_limite:   z.string().optional(),
  cuentaId:       z.number().optional().nullable(),
  notas:          z.string().optional(),
});

const aportacionSchema = z.object({
  monto: z.string().min(1).refine((v) => Number(v) > 0, "Debe ser mayor a 0"),
  notas: z.string().optional(),
});

type MetaForm       = z.infer<typeof metaSchema>;
type AportacionForm = z.infer<typeof aportacionSchema>;

export default function NuevaMeta() {
  const goBack = useGoBack();
  const { aportarId } = useLocalSearchParams<{ aportarId?: string }>();
  const isAportacion  = !!aportarId;

  const crear   = useCrearMeta();
  const aportar = useAportarMeta();
  const { data: cuentas = [] } = useCuentas();
  const { toast, show, hide }  = useToast();

  const metaForm = useForm<MetaForm>({
    resolver: zodResolver(metaSchema),
    defaultValues: { nombre: "", monto_objetivo: "", fecha_limite: "", notas: "" },
  });

  const aportacionForm = useForm<AportacionForm>({
    resolver: zodResolver(aportacionSchema),
    defaultValues: { monto: "", notas: "" },
  });

  const onSubmitMeta = (data: MetaForm) => {
    crear.mutate(
      {
        nombre:         data.nombre,
        monto_objetivo: Number(data.monto_objetivo),
        fecha_limite:   data.fecha_limite || undefined,
        cuentaId:       data.cuentaId,
        notas:          data.notas,
      },
      { onSuccess: () => goBack(), onError: (e) => show(e.message, "error") }
    );
  };

  const onSubmitAportacion = (data: AportacionForm) => {
    aportar.mutate(
      { id: Number(aportarId), monto: Number(data.monto), fecha: todayISO(), notas: data.notas },
      { onSuccess: () => goBack(), onError: (e) => show(e.message, "error") }
    );
  };

  if (isAportacion) {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>
              💡 Registra cuánto vas a aportar a esta meta hoy.
            </Text>
          </View>

          <Controller control={aportacionForm.control} name="monto" render={({ field: { value, onChange } }) => (
            <Input label="Monto a aportar" keyboardType="decimal-pad" placeholder="0.00" value={value} onChangeText={onChange} error={aportacionForm.formState.errors.monto?.message} />
          )} />

          <Controller control={aportacionForm.control} name="notas" render={({ field: { value, onChange } }) => (
            <Input label="Notas (opcional)" placeholder="Ej. Quincena de enero" value={value} onChangeText={onChange} />
          )} />
        </ScrollView>

        <ModalFooter label="Registrar aportación" onPress={aportacionForm.handleSubmit(onSubmitAportacion)} loading={aportar.isPending} />
        <Toast message={toast.message} type={toast.type} visible={toast.visible} onHide={hide} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Controller control={metaForm.control} name="nombre" render={({ field: { value, onChange } }) => (
          <Input label="Nombre" placeholder="Ej. Vacaciones en la playa" value={value} onChangeText={onChange} error={metaForm.formState.errors.nombre?.message} />
        )} />

        <Controller control={metaForm.control} name="monto_objetivo" render={({ field: { value, onChange } }) => (
          <Input label="Monto objetivo" keyboardType="decimal-pad" placeholder="0.00" value={value} onChangeText={onChange} error={metaForm.formState.errors.monto_objetivo?.message} />
        )} />

        <Controller control={metaForm.control} name="fecha_limite" render={({ field: { value, onChange } }) => (
          <DatePicker
            label="Fecha límite (opcional)"
            value={value ?? ""}
            onChange={onChange}
            minimumDate={new Date()}
          />
        )} />

        {cuentas.length > 0 && (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Cuenta asociada (opcional)</Text>
            <Controller control={metaForm.control} name="cuentaId" render={({ field: { value, onChange } }) => (
              <ChipSelector options={cuentas.map((c) => ({ value: c.id, label: c.nombre }))} value={value} onChange={(v) => onChange(v)} nullable />
            )} />
          </View>
        )}

        <Controller control={metaForm.control} name="notas" render={({ field: { value, onChange } }) => (
          <Input label="Notas (opcional)" placeholder="Ej. Para el viaje de verano" value={value} onChangeText={onChange} multiline numberOfLines={3} />
        )} />
      </ScrollView>

      <ModalFooter label="Crear meta" onPress={metaForm.handleSubmit(onSubmitMeta)} loading={crear.isPending} />
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onHide={hide} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: "#FFFFFF" },
  scroll:     { padding: 20, paddingBottom: 16 },
  fieldGroup: { marginBottom: 20 },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  infoBanner: {
    backgroundColor: "#EEF2FF",
    borderWidth:     1,
    borderColor:     "#C7D2FE",
    borderRadius:    14,
    padding:         14,
    marginBottom:    24,
  },
  infoBannerText: { fontSize: 14, color: "#4F46E5", fontWeight: "500", lineHeight: 20 },
});
