import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Categorías de gasto
  const gastosDefault = [
    { nombre: "Alimentación", color: "#F59E0B", icono: "utensils" },
    { nombre: "Transporte", color: "#3B82F6", icono: "car" },
    { nombre: "Entretenimiento", color: "#8B5CF6", icono: "film" },
    { nombre: "Salud", color: "#EF4444", icono: "heart" },
    { nombre: "Educación", color: "#10B981", icono: "book" },
    { nombre: "Ropa", color: "#EC4899", icono: "shirt" },
    { nombre: "Hogar", color: "#6366F1", icono: "home" },
    { nombre: "Servicios", color: "#14B8A6", icono: "zap" },
    { nombre: "Suscripciones", color: "#F97316", icono: "repeat" },
    { nombre: "Otros gastos", color: "#6B7280", icono: "more-horizontal" },
  ];

  // Categorías de ingreso
  const ingresosDefault = [
    { nombre: "Salario", color: "#10B981", icono: "briefcase" },
    { nombre: "Freelance", color: "#3B82F6", icono: "laptop" },
    { nombre: "Inversiones", color: "#8B5CF6", icono: "trending-up" },
    { nombre: "Regalo", color: "#EC4899", icono: "gift" },
    { nombre: "Otros ingresos", color: "#6B7280", icono: "plus-circle" },
  ];

  for (const cat of gastosDefault) {
    await prisma.categoria.upsert({
      where: { id: -1 }, // fuerza create
      update: {},
      create: { ...cat, tipo: "gasto", es_default: true },
    });
  }

  for (const cat of ingresosDefault) {
    await prisma.categoria.upsert({
      where: { id: -1 },
      update: {},
      create: { ...cat, tipo: "ingreso", es_default: true },
    });
  }

  console.log("✅ Seed completado: categorías predeterminadas creadas");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
