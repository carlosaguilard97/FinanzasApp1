import { Router, Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { suscripcionSchema } from "../schemas";

const router = Router();

// GET /api/suscripciones
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const suscripciones = await prisma.suscripcion.findMany({
      include: {
        categoria: { select: { id: true, nombre: true, color: true, icono: true } },
        cuenta: { select: { id: true, nombre: true } },
      },
      orderBy: { proximo_cobro: "asc" },
    });
    res.json({ data: suscripciones });
  } catch (err) {
    next(err);
  }
});

// POST /api/suscripciones
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = suscripcionSchema.parse(req.body);
    const suscripcion = await prisma.suscripcion.create({
      data: { ...body, proximo_cobro: new Date(body.proximo_cobro) },
    });
    res.status(201).json({ data: suscripcion, message: "Suscripción creada" });
  } catch (err) {
    next(err);
  }
});

// PUT /api/suscripciones/:id
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const body = suscripcionSchema.partial().parse(req.body);
    const data = { ...body, ...(body.proximo_cobro ? { proximo_cobro: new Date(body.proximo_cobro) } : {}) };
    const suscripcion = await prisma.suscripcion.update({ where: { id }, data });
    res.json({ data: suscripcion, message: "Suscripción actualizada" });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/suscripciones/:id/toggle
router.patch("/:id/toggle", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const actual = await prisma.suscripcion.findUniqueOrThrow({ where: { id } });
    const suscripcion = await prisma.suscripcion.update({
      where: { id },
      data: { activa: !actual.activa },
    });
    res.json({ data: suscripcion, message: `Suscripción ${suscripcion.activa ? "activada" : "desactivada"}` });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/suscripciones/:id
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.suscripcion.delete({ where: { id } });
    res.json({ message: "Suscripción eliminada" });
  } catch (err) {
    next(err);
  }
});

export default router;
