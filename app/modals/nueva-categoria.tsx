import { View, Text, Pressable, StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCrearCategoria } from "../../hooks/useCategorias";
import { Input } from "../../components/ui/Input";
import { ChipSelector } from "../../components/ui/ChipSelector";
import { ModalFooter } from "../../components/ui/ModalFooter";
import { Toast } from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";
import { useGoBack } from "../../lib/utils";

const COLORES = [
  "#F59E0B", "#3B82F6", "#8B5CF6", "#EF4444",
  "#10B981", "#EC4899", "#6366F1", "#14B8A6",
  "#F97316", "#6B7280",
];

const schema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  tipo:   z.enum(["ingreso", "gasto"]),
  color:  z.string().default("#6B7280"),
  icono:  z.string().default("tag"),
});

type FormData = z.infer<typeof schema>;

export default function NuevaCategoria() {
  const goBack = useGoBack();
  const crear  = useCrearCategoria();
  const { toast, show, hide } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: "", tipo: "gasto", color: "#6B7280", icono: "tag" },
  });

  const onSubmit = (data: FormData) => {
    crear.mutate(data, {
      onSuccess: () => goBack(),
      onError:   (e) => show(e.message, "error"),
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Controller control={control} name="nombre" render={({ field: { value, onChange } }) => (
          <Input label="Nombre" placeholder="Ej. Gym" value={value} onChangeText={onChange} error={errors.nombre?.message} />
        )} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Tipo</Text>
          <Controller control={control} name="tipo" render={({ field: { value, onChange } }) => (
            <ChipSelector
              options={[
                { value: "gasto",   label: "💸 Gasto" },
                { value: "ingreso", label: "💰 Ingreso" },
              ]}
              value={value}
              onChange={(v) => onChange(v)}
            />
          )} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Color</Text>
          <Controller control={control} name="color" render={({ field: { value, onChange } }) => (
            <View style={styles.colorGrid}>
              {COLORES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => onChange(c)}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    value === c && styles.colorDotSelected,
                  ]}
                />
              ))}
            </View>
          )} />
        </View>
      </ScrollView>

      <ModalFooter label="Crear categoría" onPress={handleSubmit(onSubmit)} loading={crear.isPending} />
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onHide={hide} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: "#FFFFFF" },
  scroll:     { padding: 20, paddingBottom: 16 },
  fieldGroup: { marginBottom: 20 },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  colorGrid:  { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  colorDot:   { width: 48, height: 48, borderRadius: 24 },
  colorDotSelected: { borderWidth: 3, borderColor: "#111827" },
});
