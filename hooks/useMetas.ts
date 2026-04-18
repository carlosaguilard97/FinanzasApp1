import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Meta } from "../types";

const KEY = "metas";

export function useMetas() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => api.get<{ data: Meta[] }>("/metas").then((r) => r.data),
  });
}

export function useCrearMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      nombre: string;
      monto_objetivo: number;
      fecha_limite?: string | null;
      cuentaId?: number | null;
      notas?: string;
    }) => api.post("/metas", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useEditarMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Meta> & { id: number }) =>
      api.put(`/metas/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useAportarMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number; monto: number; fecha: string; notas?: string }) =>
      api.post(`/metas/${id}/aportacion`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useEliminarMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/metas/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
