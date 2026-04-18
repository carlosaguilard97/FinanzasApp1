import { Router, Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { cuentaSchema } from "../schemas";
import { Decimal } from "@prisma/client/runtime/library";

const router = Router();

// Calcular saldo actual de una cuenta
function calcularSaldo(saldo_inicial: Decimal, movimientos: { tipo: string; monto: Decimal }[]) {
  return movimientos.reduce((acc, m) => {
    return m.tipo === "ingreso" ? acc + Number(m.monto) : acc - Number(m.monto);
  }, Number(saldo_inicial));
}

// GET /api/cuentas
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cuentas = await prisma.cuenta.findMany({
      include: { movimientos: { select: { tipo: true, monto: true } } },
      orderBy: { createdAt: "asc" },
    });

    const data = cuentas.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      tipo: c.tipo,
      moneda: c.moneda,
      saldo_inicial: Number(c.saldo_inicial),
      saldo_actual: calcularSaldo(c.saldo_inicial, c.movimientos),
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

// POST /api/cuentas
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = cuentaSchema.parse(req.body);
    const cuenta = await prisma.cuenta.create({ data: body });
    res.status(201).json({ data: cuenta, message: "Cuenta creada" });
  } catch (err) {
    next(err);
  }
});

// PUT /api/cuentas/:id
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const body = cuentaSchema.partial().parse(req.body);
    const cuenta = await prisma.cuenta.update({ where: { id }, data: body });
    res.json({ data: cuenta, message: "Cuenta actualizada" });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cuentas/:id
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const count = await prisma.movimiento.count({ where: { cuentaId: id } });
    if (count > 0) {
      return res.status(409).json({
        error: "No se puede eliminar una cuenta con movimientos registrados",
        code: "HAS_DEPENDENCIES",
      });
    }
    await prisma.cuenta.delete({ where: { id } });
    res.json({ message: "Cuenta eliminada" });
  } catch (err) {
    next(err);
  }
});

export default router;
