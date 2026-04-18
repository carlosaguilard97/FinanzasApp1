import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Cuenta } from "../types";

const KEY = "cuentas";

export function useCuentas() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => api.get<{ data: Cuenta[] }>("/cuentas").then((r) => r.data),
  });
}

export function useCrearCuenta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<Cuenta, "id" | "saldo_actual" | "createdAt" | "updatedAt">) =>
      api.post("/cuentas", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useEditarCuenta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Cuenta> & { id: number }) =>
      api.put(`/cuentas/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useEliminarCuenta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/cuentas/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
