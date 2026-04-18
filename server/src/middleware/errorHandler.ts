import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Datos inválidos",
      code: "VALIDATION_ERROR",
      details: err.flatten().fieldErrors,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Ya existe un registro con esos datos", code: "DUPLICATE" });
    }
    if (err.code === "P2003" || err.code === "P2014") {
      return res.status(409).json({ error: "No se puede eliminar, tiene registros asociados", code: "HAS_DEPENDENCIES" });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Registro no encontrado", code: "NOT_FOUND" });
    }
  }

  console.error(err);
  return res.status(500).json({ error: "Error interno del servidor", code: "INTERNAL_ERROR" });
}
