import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Suscripcion } from "../types";

const KEY = "suscripciones";

export function useSuscripciones() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => api.get<{ data: Suscripcion[] }>("/suscripciones").then((r) => r.data),
  });
}

export function useCrearSuscripcion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<Suscripcion, "id" | "categoria" | "cuenta">) =>
      api.post("/suscripciones", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useEditarSuscripcion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Suscripcion> & { id: number }) =>
      api.put(`/suscripciones/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useToggleSuscripcion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.patch(`/suscripciones/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useEliminarSuscripcion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/suscripciones/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
