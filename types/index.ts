export type TipoCuenta = "efectivo" | "banco" | "debito" | "credito" | "inversion" | "otro";
export type TipoMovimiento = "ingreso" | "gasto";
export type Frecuencia = "semanal" | "mensual" | "anual";

export interface Cuenta {
  id: number;
  nombre: string;
  tipo: TipoCuenta;
  moneda: string;
  saldo_inicial: number;
  saldo_actual: number;
  createdAt: string;
  updatedAt: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  tipo: TipoMovimiento;
  color: string;
  icono: string;
  es_default: boolean;
}

export interface Movimiento {
  id: number;
  tipo: TipoMovimiento;
  monto: number;
  descripcion?: string;
  fecha: string;
  cuenta: Pick<Cuenta, "id" | "nombre" | "moneda">;
  categoria: Pick<Categoria, "id" | "nombre" | "color" | "icono">;
  createdAt: string;
}

export interface Suscripcion {
  id: number;
  nombre: string;
  monto: number;
  frecuencia: Frecuencia;
  proximo_cobro: string;
  activa: boolean;
  notas?: string;
  categoria?: Pick<Categoria, "id" | "nombre" | "color" | "icono"> | null;
  cuenta?: Pick<Cuenta, "id" | "nombre"> | null;
}

export interface Meta {
  id: number;
  nombre: string;
  monto_objetivo: number;
  monto_actual: number;
  fecha_limite?: string | null;
  completada: boolean;
  notas?: string;
  cuenta?: Pick<Cuenta, "id" | "nombre"> | null;
  aportaciones: MetaAportacion[];
}

export interface MetaAportacion {
  id: number;
  monto: number;
  fecha: string;
  notas?: string;
}

export interface ResumenDashboard {
  ingresos: number;
  gastos: number;
  ahorro: number;
  gastosPorCategoria: { categoriaId: number; nombre: string; color: string; total: number }[];
  historial: { mes: string; ingresos: number; gastos: number }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
