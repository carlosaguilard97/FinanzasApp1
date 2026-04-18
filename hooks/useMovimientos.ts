import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Movimiento, PaginatedResponse } from "../types";

const KEY = "movimientos";

export interface MovimientosFiltros {
  cuentaId?: number;
  categoriaId?: number;
  tipo?: "ingreso" | "gasto";
  desde?: string;
  hasta?: string;
  page?: number;
  limit?: number;
  q?: string;
}

export function useMovimientos(filtros: MovimientosFiltros = {}) {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.append(k, String(v));
  });

  return useQuery({
    queryKey: [KEY, filtros],
    queryFn: () =>
      api.get<PaginatedResponse<Movimiento>>(`/movimientos?${params.toString()}`),
  });
}

export function useResumenDashboard() {
  return useQuery({
    queryKey: [KEY, "resumen"],
    queryFn: () =>
      api.get<{ data: import("../types").ResumenDashboard }>("/movimientos/resumen").then((r) => r.data),
    staleTime: 1000 * 60,
  });
}

export function useCrearMovimiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<Movimiento, "id" | "cuenta" | "categoria" | "createdAt"> & { cuentaId: number; categoriaId: number }) =>
      api.post("/movimientos", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
      qc.invalidateQueries({ queryKey: ["cuentas"] });
    },
  });
}

export function useEditarMovimiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number } & Partial<Movimiento & { cuentaId: number; categoriaId: number }>) =>
      api.put(`/movimientos/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
      qc.invalidateQueries({ queryKey: ["cuentas"] });
    },
  });
}

export function useEliminarMovimiento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/movimientos/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
      qc.invalidateQueries({ queryKey: ["cuentas"] });
    },
  });
}
