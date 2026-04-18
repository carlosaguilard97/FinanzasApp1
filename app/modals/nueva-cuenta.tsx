import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCrearCuenta } from "../../hooks/useCuentas";
import { Input } from "../../components/ui/Input";
import { ChipSelector } from "../../components/ui/ChipSelector";
import { ModalFooter } from "../../components/ui/ModalFooter";
import { Toast } from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";
import { useGoBack } from "../../lib/utils";

const TIPOS   = [
  { value: "efectivo",  label: "💵 Efectivo" },
  { value: "banco",     label: "🏦 Banco" },
  { value: "debito",    label: "💳 Débito" },
  { value: "credito",   label: "💳 Crédito" },
  { value: "inversion", label: "📈 Inversión" },
  { value: "otro",      label: "🪙 Otro" },
];
const MONEDAS = [
  { value: "MXN", label: "MXN 🇲🇽" },
  { value: "USD", label: "USD 🇺🇸" },
  { value: "EUR", label: "EUR 🇪🇺" },
];

const schema = z.object({
  nombre:        z.string().min(1, "El nombre es requerido"),
  tipo:          z.enum(["efectivo", "banco", "debito", "credito", "inversion", "otro"]),
  moneda:        z.string().default("MXN"),
  saldo_inicial: z.string().refine((v) => Number(v) >= 0, "El saldo no puede ser negativo"),
});

type FormData = z.infer<typeof schema>;

export default function NuevaCuenta() {
  const goBack = useGoBack();
  const crear  = useCrearCuenta();
  const { toast, show, hide } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: "", tipo: "banco", moneda: "MXN", saldo_inicial: "0" },
  });

  const onSubmit = (data: FormData) => {
    crear.mutate(
      { ...data, saldo_inicial: Number(data.saldo_inicial) },
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
          <Input label="Nombre" placeholder="Ej. BBVA Nómina" value={value} onChangeText={onChange} error={errors.nombre?.message} />
        )} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Tipo de cuenta</Text>
          <Controller control={control} name="tipo" render={({ field: { value, onChange } }) => (
            <ChipSelector options={TIPOS} value={value} onChange={(v) => onChange(v)} />
          )} />
        </View>

        <Controller control={control} name="saldo_inicial" render={({ field: { value, onChange } }) => (
          <Input label="Saldo inicial" keyboardType="decimal-pad" placeholder="0.00" value={value} onChangeText={onChange} error={errors.saldo_inicial?.message} hint="El saldo actual se calculará sumando tus movimientos" />
        )} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Moneda</Text>
          <Controller control={control} name="moneda" render={({ field: { value, onChange } }) => (
            <ChipSelector options={MONEDAS} value={value} onChange={(v) => onChange(v)} />
          )} />
        </View>
      </ScrollView>

      <ModalFooter label="Crear cuenta" onPress={handleSubmit(onSubmit)} loading={crear.isPending} />
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
