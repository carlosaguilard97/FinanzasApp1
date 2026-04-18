import { z } from "zod";

export const cuentaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  tipo: z.enum(["efectivo", "banco", "debito", "credito", "inversion", "otro"]),
  moneda: z.string().default("MXN"),
  saldo_inicial: z.number().min(0, "El saldo inicial no puede ser negativo").default(0),
});

export const categoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  tipo: z.enum(["ingreso", "gasto"]),
  color: z.string().default("#6B7280"),
  icono: z.string().default("tag"),
});

export const movimientoSchema = z.object({
  tipo: z.enum(["ingreso", "gasto"]),
  monto: z.number().positive("El monto debe ser mayor a 0"),
  descripcion: z.string().optional(),
  fecha: z.string().datetime().or(z.string().date()),
  cuentaId: z.number().int().positive(),
  categoriaId: z.number().int().positive(),
});

export const suscripcionSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  monto: z.number().positive("El monto debe ser mayor a 0"),
  frecuencia: z.enum(["semanal", "mensual", "anual"]),
  proximo_cobro: z.string().datetime().or(z.string().date()),
  activa: z.boolean().default(true),
  notas: z.string().optional(),
  categoriaId: z.number().int().positive().optional().nullable(),
  cuentaId: z.number().int().positive().optional().nullable(),
});

export const metaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  monto_objetivo: z.number().positive("El monto objetivo debe ser mayor a 0"),
  fecha_limite: z.string().datetime().or(z.string().date()).optional().nullable(),
  notas: z.string().optional(),
  cuentaId: z.number().int().positive().optional().nullable(),
});

export const aportacionSchema = z.object({
  monto: z.number().positive("El monto debe ser mayor a 0"),
  fecha: z.string().datetime().or(z.string().date()),
  notas: z.string().optional(),
});
