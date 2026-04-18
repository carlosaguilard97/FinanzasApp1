import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCrearSuscripcion } from "../../hooks/useSuscripciones";
import { useCuentas } from "../../hooks/useCuentas";
import { useCategorias } from "../../hooks/useCategorias";
import { Input } from "../../components/ui/Input";
import { DatePicker } from "../../components/ui/DatePicker";
import { ChipSelector } from "../../components/ui/ChipSelector";
import { ModalFooter } from "../../components/ui/ModalFooter";
import { Toast } from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";
import { useGoBack, todayISO } from "../../lib/utils";

const schema = z.object({
  nombre:        z.string().min(1, "El nombre es requerido"),
  monto:         z.string().min(1, "Ingresa un monto").refine((v) => Number(v) > 0, "Debe ser mayor a 0"),
  frecuencia:    z.enum(["semanal", "mensual", "anual"]),
  proximo_cobro: z.string().min(1, "La fecha es requerida"),
  cuentaId:      z.number().optional().nullable(),
  categoriaId:   z.number().optional().nullable(),
  notas:         z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NuevaSuscripcion() {
  const goBack = useGoBack();
  const crear  = useCrearSuscripcion();
  const { data: cuentas    = [] } = useCuentas();
  const { data: categorias = [] } = useCategorias("gasto");
  const { toast, show, hide }     = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: "", monto: "", frecuencia: "mensual", proximo_cobro: todayISO(), notas: "" },
  });

  const onSubmit = (data: FormData) => {
    crear.mutate(
      {
        nombre:        data.nombre,
        monto:         Number(data.monto),
        frecuencia:    data.frecuencia,
        proximo_cobro: data.proximo_cobro,
        activa:        true,
        cuentaId:      data.cuentaId,
        categoriaId:   data.categoriaId,
        notas:         data.notas,
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
        <Controller control={control} name="nombre" render={({ field: { value, onChange } }) => (
          <Input label="Nombre" placeholder="Ej. Netflix" value={value} onChangeText={onChange} error={errors.nombre?.message} />
        )} />

        <Controller control={control} name="monto" render={({ field: { value, onChange } }) => (
          <Input label="Monto" keyboardType="decimal-pad" placeholder="0.00" value={value} onChangeText={onChange} error={errors.monto?.message} />
        )} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Frecuencia</Text>
          <Controller control={control} name="frecuencia" render={({ field: { value, onChange } }) => (
            <ChipSelector
              options={[
                { value: "semanal", label: "Semanal" },
                { value: "mensual", label: "Mensual" },
                { value: "anual",   label: "Anual" },
              ]}
              value={value}
              onChange={(v) => onChange(v)}
            />
          )} />
        </View>

        <Controller control={control} name="proximo_cobro" render={({ field: { value, onChange } }) => (
          <DatePicker label="Próximo cobro" value={value} onChange={onChange} error={errors.proximo_cobro?.message} />
        )} />

        {cuentas.length > 0 && (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Cuenta (opcional)</Text>
            <Controller control={control} name="cuentaId" render={({ field: { value, onChange } }) => (
              <ChipSelector options={cuentas.map((c) => ({ value: c.id, label: c.nombre }))} value={value} onChange={(v) => onChange(v)} nullable />
            )} />
          </View>
        )}

        {categorias.length > 0 && (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Categoría (opcional)</Text>
            <Controller control={control} name="categoriaId" render={({ field: { value, onChange } }) => (
              <ChipSelector options={categorias.map((c) => ({ value: c.id, label: c.nombre, color: c.color }))} value={value} onChange={(v) => onChange(v)} nullable />
            )} />
          </View>
        )}

        <Controller control={control} name="notas" render={({ field: { value, onChange } }) => (
          <Input label="Notas (opcional)" placeholder="Ej. Plan familiar" value={value} onChangeText={onChange} multiline numberOfLines={3} />
        )} />
      </ScrollView>

      <ModalFooter label="Guardar suscripción" onPress={handleSubmit(onSubmit)} loading={crear.isPending} />
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onHide={hide} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: "#FFFFFF" },
  scroll:     { padding: 20, paddingBottom: 16 },
  fieldGroup: { marginBottom: 20 },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
});
