# Arquitectura de Datos — FinanzasApp

## 1. Diagrama Entidad-Relación

```
┌─────────────────┐         ┌─────────────────────┐
│    cuentas      │         │     categorias       │
├─────────────────┤         ├─────────────────────┤
│ id (PK)         │         │ id (PK)              │
│ nombre          │         │ nombre               │
│ tipo            │         │ tipo (ingreso/gasto) │
│ moneda          │         │ color                │
│ saldo_inicial   │         │ icono                │
│ createdAt       │         │ es_default           │
│ updatedAt       │         │ createdAt            │
└────────┬────────┘         │ updatedAt            │
         │                  └──────────┬───────────┘
         │                             │
         │         ┌───────────────────┘
         │         │
         ▼         ▼
┌──────────────────────────────────┐
│           movimientos            │
├──────────────────────────────────┤
│ id (PK)                          │
│ tipo (ingreso/gasto)             │
│ monto (Decimal)                  │
│ descripcion                      │
│ fecha                            │
│ cuentaId (FK → cuentas)          │
│ categoriaId (FK → categorias)    │
│ createdAt                        │
│ updatedAt                        │
└──────────────────────────────────┘

┌─────────────────────────────────────┐
│           suscripciones             │
├─────────────────────────────────────┤
│ id (PK)                             │
│ nombre                              │
│ monto (Decimal)                     │
│ frecuencia (mensual/anual/semanal)  │
│ proximo_cobro (Date)                │
│ activa (Boolean)                    │
│ notas                               │
│ categoriaId (FK → categorias, null) │
│ cuentaId (FK → cuentas, null)       │
│ createdAt                           │
│ updatedAt                           │
└─────────────────────────────────────┘

┌──────────────────────────────────┐
│             metas                │
├──────────────────────────────────┤
│ id (PK)                          │
│ nombre                           │
│ monto_objetivo (Decimal)         │
│ monto_actual (Decimal)           │
│ fecha_limite (Date, null)        │
│ completada (Boolean)             │
│ notas                            │
│ cuentaId (FK → cuentas, null)    │
│ createdAt                        │
│ updatedAt                        │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│        meta_aportaciones         │
├──────────────────────────────────┤
│ id (PK)                          │
│ monto (Decimal)                  │
│ fecha                            │
│ notas                            │
│ metaId (FK → metas)              │
│ createdAt                        │
└──────────────────────────────────┘
```

---

## 2. Esquema Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum TipoCuenta {
  efectivo
  banco
  debito
  credito
  inversion
  otro
}

enum TipoMovimiento {
  ingreso
  gasto
}

enum Frecuencia {
  semanal
  mensual
  anual
}

model Cuenta {
  id            Int            @id @default(autoincrement())
  nombre        String
  tipo          TipoCuenta
  moneda        String         @default("MXN")
  saldo_inicial Decimal        @default(0) @db.Decimal(12, 2)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  movimientos   Movimiento[]
  suscripciones Suscripcion[]
  metas         Meta[]
}

model Categoria {
  id         Int            @id @default(autoincrement())
  nombre     String
  tipo       TipoMovimiento
  color      String         @default("#6B7280")
  icono      String         @default("tag")
  es_default Boolean        @default(false)
  createdAt  DateTime       @default(now())
  updatedAt  DateTime       @updatedAt

  movimientos   Movimiento[]
  suscripciones Suscripcion[]
}

model Movimiento {
  id          Int            @id @default(autoincrement())
  tipo        TipoMovimiento
  monto       Decimal        @db.Decimal(12, 2)
  descripcion String?
  fecha       DateTime
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  cuentaId    Int
  cuenta      Cuenta         @relation(fields: [cuentaId], references: [id])

  categoriaId Int
  categoria   Categoria      @relation(fields: [categoriaId], references: [id])
}

model Suscripcion {
  id            Int        @id @default(autoincrement())
  nombre        String
  monto         Decimal    @db.Decimal(12, 2)
  frecuencia    Frecuencia
  proximo_cobro DateTime
  activa        Boolean    @default(true)
  notas         String?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  categoriaId   Int?
  categoria     Categoria? @relation(fields: [categoriaId], references: [id])

  cuentaId      Int?
  cuenta        Cuenta?    @relation(fields: [cuentaId], references: [id])
}

model Meta {
  id             Int       @id @default(autoincrement())
  nombre         String
  monto_objetivo Decimal   @db.Decimal(12, 2)
  monto_actual   Decimal   @default(0) @db.Decimal(12, 2)
  fecha_limite   DateTime?
  completada     Boolean   @default(false)
  notas          String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  cuentaId      Int?
  cuenta        Cuenta?   @relation(fields: [cuentaId], references: [id])

  aportaciones  MetaAportacion[]
}

model MetaAportacion {
  id        Int      @id @default(autoincrement())
  monto     Decimal  @db.Decimal(12, 2)
  fecha     DateTime
  notas     String?
  createdAt DateTime @default(now())

  metaId    Int
  meta      Meta     @relation(fields: [metaId], references: [id], onDelete: Cascade)
}
```

---

## 3. Índices

```sql
-- Movimientos: consultas frecuentes por cuenta y fecha
CREATE INDEX idx_movimientos_cuenta ON movimientos(cuentaId);
CREATE INDEX idx_movimientos_fecha ON movimientos(fecha DESC);
CREATE INDEX idx_movimientos_tipo ON movimientos(tipo);
CREATE INDEX idx_movimientos_categoria ON movimientos(categoriaId);

-- Suscripciones: consultas por próximo cobro
CREATE INDEX idx_suscripciones_proximo_cobro ON suscripciones(proximo_cobro);
CREATE INDEX idx_suscripciones_activa ON suscripciones(activa);

-- Metas: consultas por estado
CREATE INDEX idx_metas_completada ON metas(completada);
```

En Prisma se definen con `@@index`:
```prisma
model Movimiento {
  // ...campos
  @@index([cuentaId])
  @@index([fecha(sort: Desc)])
  @@index([tipo])
  @@index([categoriaId])
}
```

---

## 4. Cálculo de Saldo

El saldo de una cuenta no se almacena directamente (excepto el saldo inicial). Se calcula en tiempo de consulta para garantizar consistencia:

```sql
SELECT
  c.id,
  c.nombre,
  c.tipo,
  c.moneda,
  c.saldo_inicial + COALESCE(SUM(
    CASE
      WHEN m.tipo = 'ingreso' THEN m.monto
      WHEN m.tipo = 'gasto'   THEN -m.monto
      ELSE 0
    END
  ), 0) AS saldo_actual
FROM cuentas c
LEFT JOIN movimientos m ON m.cuentaId = c.id
GROUP BY c.id;
```

En Prisma:
```typescript
const cuentas = await prisma.cuenta.findMany({
  include: {
    _count: { select: { movimientos: true } },
    movimientos: {
      select: { tipo: true, monto: true }
    }
  }
});
// El saldo se calcula en el servidor antes de enviar la respuesta
```

---

## 5. Datos Semilla (Seed)

Categorías predeterminadas que se insertan al inicializar la base de datos:

**Gastos:**
| Nombre | Color | Ícono |
|---|---|---|
| Alimentación | #F59E0B | utensils |
| Transporte | #3B82F6 | car |
| Entretenimiento | #8B5CF6 | film |
| Salud | #EF4444 | heart |
| Educación | #10B981 | book |
| Ropa | #EC4899 | shirt |
| Hogar | #6366F1 | home |
| Servicios | #14B8A6 | zap |
| Suscripciones | #F97316 | repeat |
| Otros gastos | #6B7280 | more-horizontal |

**Ingresos:**
| Nombre | Color | Ícono |
|---|---|---|
| Salario | #10B981 | briefcase |
| Freelance | #3B82F6 | laptop |
| Inversiones | #8B5CF6 | trending-up |
| Regalo | #EC4899 | gift |
| Otros ingresos | #6B7280 | plus-circle |

---

## 6. Consideraciones de Integridad

- `onDelete: Cascade` en `MetaAportacion` → al eliminar una meta se eliminan sus aportaciones
- `onDelete: Restrict` implícito en `Movimiento` → no se puede eliminar una cuenta o categoría con movimientos
- Montos almacenados como `Decimal(12,2)` para evitar errores de punto flotante en operaciones financieras
- Fechas almacenadas en UTC, conversión a zona horaria local en el cliente
