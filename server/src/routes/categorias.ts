import { Router, Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { categoriaSchema } from "../schemas";

const router = Router();

// GET /api/categorias?tipo=gasto
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tipo = req.query.tipo as string | undefined;
    const categorias = await prisma.categoria.findMany({
      where: tipo ? { tipo: tipo as "ingreso" | "gasto" } : undefined,
      orderBy: [{ es_default: "desc" }, { nombre: "asc" }],
    });
    res.json({ data: categorias });
  } catch (err) {
    next(err);
  }
});

// POST /api/categorias
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = categoriaSchema.parse(req.body);
    const categoria = await prisma.categoria.create({ data: body });
    res.status(201).json({ data: categoria, message: "Categoría creada" });
  } catch (err) {
    next(err);
  }
});

// PUT /api/categorias/:id
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const body = categoriaSchema.partial().parse(req.body);
    const categoria = await prisma.categoria.update({ where: { id }, data: body });
    res.json({ data: categoria, message: "Categoría actualizada" });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/categorias/:id
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const movCount = await prisma.movimiento.count({ where: { categoriaId: id } });
    const subCount = await prisma.suscripcion.count({ where: { categoriaId: id } });
    if (movCount > 0 || subCount > 0) {
      return res.status(409).json({
        error: "No se puede eliminar, tiene registros asociados",
        code: "HAS_DEPENDENCIES",
      });
    }
    await prisma.categoria.delete({ where: { id } });
    res.json({ message: "Categoría eliminada" });
  } catch (err) {
    next(err);
  }
});

export default router;
