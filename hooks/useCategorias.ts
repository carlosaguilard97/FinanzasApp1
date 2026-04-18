import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Categoria, TipoMovimiento } from "../types";

const KEY = "categorias";

export function useCategorias(tipo?: TipoMovimiento) {
  return useQuery({
    queryKey: [KEY, tipo],
    queryFn: () =>
      api.get<{ data: Categoria[] }>(`/categorias${tipo ? `?tipo=${tipo}` : ""}`).then((r) => r.data),
  });
}

export function useCrearCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Pick<Categoria, "nombre" | "tipo" | "color" | "icono">) =>
      api.post("/categorias", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useEditarCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Categoria> & { id: number }) =>
      api.put(`/categorias/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useEliminarCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/categorias/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
