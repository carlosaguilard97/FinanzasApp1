import { Router, Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { movimientoSchema } from "../schemas";

const router = Router();

// GET /api/movimientos/resumen  (debe ir antes de /:id)
router.get("/resumen", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ahora = new Date();
    const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const fin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);

    const movimientos = await prisma.movimiento.findMany({
      where: { fecha: { gte: inicio, lte: fin } },
      select: { tipo: true, monto: true },
    });

    const ingresos = movimientos
      .filter((m) => m.tipo === "ingreso")
      .reduce((acc, m) => acc + Number(m.monto), 0);

    const gastos = movimientos
      .filter((m) => m.tipo === "gasto")
      .reduce((acc, m) => acc + Number(m.monto), 0);

    // Gastos por categoría del mes
    const porCategoria = await prisma.movimiento.groupBy({
      by: ["categoriaId"],
      where: { tipo: "gasto", fecha: { gte: inicio, lte: fin } },
      _sum: { monto: true },
    });

    const categorias = await prisma.categoria.findMany({
      where: { id: { in: porCategoria.map((p) => p.categoriaId) } },
      select: { id: true, nombre: true, color: true },
    });

    const gastosPorCategoria = porCategoria.map((p) => ({
      categoriaId: p.categoriaId,
      nombre: categorias.find((c) => c.id === p.categoriaId)?.nombre ?? "",
      color: categorias.find((c) => c.id === p.categoriaId)?.color ?? "#6B7280",
      total: Number(p._sum.monto ?? 0),
    }));

    // Últimos 6 meses
    const seisMeses = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1 };
    }).reverse();

    const historial = await Promise.all(
      seisMeses.map(async ({ year, month }) => {
        const desde = new Date(year, month - 1, 1);
        const hasta = new Date(year, month, 0, 23, 59, 59);
        const movs = await prisma.movimiento.findMany({
          where: { fecha: { gte: desde, lte: hasta } },
          select: { tipo: true, monto: true },
        });
        return {
          mes: `${year}-${String(month).padStart(2, "0")}`,
          ingresos: movs.filter((m) => m.tipo === "ingreso").reduce((a, m) => a + Number(m.monto), 0),
          gastos: movs.filter((m) => m.tipo === "gasto").reduce((a, m) => a + Number(m.monto), 0),
        };
      })
    );

    res.json({ data: { ingresos, gastos, ahorro: ingresos - gastos, gastosPorCategoria, historial } });
  } catch (err) {
    next(err);
  }
});

// GET /api/movimientos
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cuentaId, categoriaId, tipo, desde, hasta, page = "1", limit = "20", q } = req.query;

    const where: Record<string, unknown> = {};
    if (cuentaId) where.cuentaId = Number(cuentaId);
    if (categoriaId) where.categoriaId = Number(categoriaId);
    if (tipo) where.tipo = tipo;
    if (desde || hasta) {
      where.fecha = {
        ...(desde ? { gte: new Date(desde as string) } : {}),
        ...(hasta ? { lte: new Date(hasta as string) } : {}),
      };
    }
    if (q) where.descripcion = { contains: q as string, mode: "insensitive" };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [total, movimientos] = await Promise.all([
      prisma.movimiento.count({ where }),
      prisma.movimiento.findMany({
        where,
        include: {
          cuenta: { select: { id: true, nombre: true, moneda: true } },
          categoria: { select: { id: true, nombre: true, color: true, icono: true } },
        },
        orderBy: { fecha: "desc" },
        skip,
        take: limitNum,
      }),
    ]);

    res.json({
      data: movimientos,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/movimientos/:id
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const movimiento = await prisma.movimiento.findUniqueOrThrow({
      where: { id },
      include: {
        cuenta: { select: { id: true, nombre: true, moneda: true } },
        categoria: { select: { id: true, nombre: true, color: true, icono: true } },
      },
    });
    res.json({ data: movimiento });
  } catch (err) {
    next(err);
  }
});

// POST /api/movimientos
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = movimientoSchema.parse(req.body);
    const movimiento = await prisma.movimiento.create({
      data: { ...body, fecha: new Date(body.fecha) },
      include: {
        cuenta: { select: { id: true, nombre: true } },
        categoria: { select: { id: true, nombre: true, color: true, icono: true } },
      },
    });
    res.status(201).json({ data: movimiento, message: "Movimiento registrado" });
  } catch (err) {
    next(err);
  }
});

// PUT /api/movimientos/:id
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const body = movimientoSchema.partial().parse(req.body);
    const data = { ...body, ...(body.fecha ? { fecha: new Date(body.fecha) } : {}) };
    const movimiento = await prisma.movimiento.update({ where: { id }, data });
    res.json({ data: movimiento, message: "Movimiento actualizado" });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/movimientos/:id
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.movimiento.delete({ where: { id } });
    res.json({ message: "Movimiento eliminado" });
  } catch (err) {
    next(err);
  }
});

export default router;
