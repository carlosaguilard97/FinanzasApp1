# Arquitectura del Sistema — FinanzasApp

## 1. Componentes del Sistema

```
┌──────────────────────────────────────────────────────────────────┐
│                        DISPOSITIVOS CLIENTE                      │
│                                                                  │
│  ┌─────────────────┐   ┌─────────────────┐  ┌────────────────┐  │
│  │   Navegador Web │   │  iPhone / iPad  │  │    Android     │  │
│  │  Chrome/Safari  │   │   Expo Go /     │  │  Expo Go /     │  │
│  │                 │   │   Build nativo  │  │  Build nativo  │  │
│  └────────┬────────┘   └────────┬────────┘  └───────┬────────┘  │
└───────────┼────────────────────┼───────────────────┼────────────┘
            │                    │                   │
            └────────────────────┼───────────────────┘
                                 │ HTTP REST (JSON)
                    ┌────────────▼────────────┐
                    │      API SERVER          │
                    │   Node.js + Express      │
                    │   Puerto: 3000           │
                    │                          │
                    │  ┌────────────────────┐  │
                    │  │   Rutas Express    │  │
                    │  │  /api/cuentas      │  │
                    │  │  /api/movimientos  │  │
                    │  │  /api/categorias   │  │
                    │  │  /api/suscripciones│  │
                    │  │  /api/metas        │  │
                    │  └────────┬───────────┘  │
                    │           │              │
                    │  ┌────────▼───────────┐  │
                    │  │    Prisma ORM      │  │
                    │  └────────┬───────────┘  │
                    └───────────┼──────────────┘
                                │
                    ┌───────────▼──────────────┐
                    │       PostgreSQL          │
                    │       Puerto: 5432        │
                    │                          │
                    │  Tablas:                 │
                    │  - cuentas               │
                    │  - categorias            │
                    │  - movimientos           │
                    │  - suscripciones         │
                    │  - metas                 │
                    │  - meta_aportaciones     │
                    └──────────────────────────┘
```

---

## 2. Entorno de Desarrollo

```
Máquina local
├── PostgreSQL (local o Docker)
├── Node.js server  →  localhost:3000
└── Expo Dev Server →  localhost:8081
    ├── Web:    http://localhost:8081
    ├── iOS:    Expo Go app (QR)
    └── Android: Expo Go app (QR)
```

### Requisitos de entorno
- Node.js 20 LTS
- PostgreSQL 16 (local o via Docker)
- Expo Go en dispositivo móvil (para desarrollo)

### Comandos de arranque
```bash
# Base de datos (Docker)
docker run --name finanzas-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=finanzas \
  -p 5432:5432 -d postgres:16

# Servidor
cd server
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
npm run dev        # puerto 3000

# Cliente (raíz del proyecto)
npm install
npx expo start     # puerto 8081
```

---

## 3. Entorno de Producción (Referencia Futura)

```
Internet
    │
    ▼
┌─────────────────────────────────────────┐
│              CDN / Hosting              │
│         (Expo EAS / Vercel)             │
│                                         │
│  Web build estático (React Native Web)  │
└──────────────────┬──────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────┐
│              VPS / Cloud                │
│         (Railway / Render / EC2)        │
│                                         │
│  Node.js + Express (PM2)                │
│  Puerto 443 (HTTPS via nginx)           │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│           PostgreSQL Managed            │
│      (Railway / Supabase / RDS)         │
└─────────────────────────────────────────┘
```

---

## 4. Comunicación entre Componentes

### Protocolo
- HTTP/1.1 en desarrollo
- HTTPS en producción
- Formato: JSON
- Sin WebSockets en fase 1 (no hay tiempo real)

### Headers relevantes
```
Content-Type: application/json
Accept: application/json
```

### CORS
El servidor configura CORS para aceptar peticiones desde:
- `http://localhost:8081` (Expo web dev)
- Dominio de producción (cuando aplique)

---

## 5. Estructura de Módulos del Servidor

```
server/src/
├── index.ts              # Entry point, configuración Express + middlewares
├── routes/
│   ├── cuentas.ts        # CRUD + cálculo de saldo dinámico
│   ├── categorias.ts     # CRUD + filtro por tipo
│   ├── movimientos.ts    # CRUD + filtros + paginación + resumen dashboard
│   ├── suscripciones.ts  # CRUD + toggle activo/inactivo
│   └── metas.ts          # CRUD + aportaciones con transacción
├── middleware/
│   └── errorHandler.ts   # Mapeo de errores Prisma y Zod a HTTP
├── schemas/
│   └── index.ts          # Todos los schemas Zod centralizados
└── lib/
    └── prisma.ts         # Instancia singleton PrismaClient
```

---

## 6. Estructura de Módulos del Cliente

```
app/                          # Solo rutas — Expo Router
├── _layout.tsx               # Root layout + QueryClientProvider
├── (tabs)/
│   ├── _layout.tsx           # Tab navigator (5 tabs con íconos emoji)
│   ├── index.tsx             # Dashboard
│   ├── movimientos.tsx       # Lista + filtros por cuenta y tipo
│   ├── cuentas.tsx           # Lista de cuentas + navegación a movimientos
│   ├── suscripciones.tsx     # Lista + toggle activo
│   └── metas.tsx             # Lista + progreso visual
└── modals/                   # Formularios como pantallas modales
    ├── nuevo-movimiento.tsx
    ├── nueva-cuenta.tsx
    ├── nueva-categoria.tsx
    ├── nueva-suscripcion.tsx
    └── nueva-meta.tsx        # Doble uso: crear meta y registrar aportación

components/ui/                # Componentes reutilizables
├── Button.tsx
├── Card.tsx
├── ChipSelector.tsx
├── ConfirmDialog.tsx
├── DatePicker.tsx
├── EmptyState.tsx
├── FAB.tsx
├── HeroHeader.tsx
├── Input.tsx
├── ModalFooter.tsx
├── SectionHeader.tsx
├── SwipeableRow.tsx
└── Toast.tsx

hooks/
├── useCuentas.ts
├── useMovimientos.ts
├── useCategorias.ts
├── useSuscripciones.ts
├── useMetas.ts
├── useToast.ts
└── useIsMobile.ts            # Detecta móvil/tablet vs desktop por ancho de ventana

lib/
├── api.ts                    # fetch wrapper tipado
├── queryClient.ts            # configuración React Query
└── utils.ts                  # formatCurrency, formatDate, diasHasta, todayISO, useGoBack

types/
└── index.ts                  # Interfaces: Cuenta, Movimiento, Categoria, etc.
```

---

## 7. Convenciones de Navegación

Expo Router usa un sistema file-based idéntico a Next.js App Router:

| Patrón | Significado |
|---|---|
| `app/(tabs)/` | Grupo de rutas con tab navigator, no afecta la URL |
| `app/modals/` | Pantallas presentadas como modal (`presentation: "modal"`) |
| `app/_layout.tsx` | Layout que envuelve las rutas del mismo nivel |

Los modales se abren con `router.push("/modals/nombre")` y se cierran con `router.back()`.
