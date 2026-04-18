import { Router, Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { metaSchema, aportacionSchema } from "../schemas";

const router = Router();

// GET /api/metas
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const metas = await prisma.meta.findMany({
      include: {
        cuenta: { select: { id: true, nombre: true } },
        aportaciones: { orderBy: { fecha: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: metas });
  } catch (err) {
    next(err);
  }
});

// POST /api/metas
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = metaSchema.parse(req.body);
    const meta = await prisma.meta.create({
      data: {
        ...body,
        ...(body.fecha_limite ? { fecha_limite: new Date(body.fecha_limite) } : {}),
      },
    });
    res.status(201).json({ data: meta, message: "Meta creada" });
  } catch (err) {
    next(err);
  }
});

// PUT /api/metas/:id
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const body = metaSchema.partial().parse(req.body);
    const data = { ...body, ...(body.fecha_limite ? { fecha_limite: new Date(body.fecha_limite) } : {}) };
    const meta = await prisma.meta.update({ where: { id }, data });
    res.json({ data: meta, message: "Meta actualizada" });
  } catch (err) {
    next(err);
  }
});

// POST /api/metas/:id/aportacion
router.post("/:id/aportacion", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metaId = Number(req.params.id);
    const body = aportacionSchema.parse(req.body);

    const meta = await prisma.meta.findUniqueOrThrow({ where: { id: metaId } });

    const nuevoMonto = Number(meta.monto_actual) + body.monto;
    const completada = nuevoMonto >= Number(meta.monto_objetivo);

    const [aportacion] = await prisma.$transaction([
      prisma.metaAportacion.create({
        data: { ...body, fecha: new Date(body.fecha), metaId },
      }),
      prisma.meta.update({
        where: { id: metaId },
        data: { monto_actual: nuevoMonto, completada },
      }),
    ]);

    res.status(201).json({ data: aportacion, message: "Aportación registrada" });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/metas/:id
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.meta.delete({ where: { id } });
    res.json({ message: "Meta eliminada" });
  } catch (err) {
    next(err);
  }
});

export default router;
