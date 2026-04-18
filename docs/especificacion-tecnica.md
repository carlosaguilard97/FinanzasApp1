# Especificación Técnica — FinanzasApp

## 1. Stack Tecnológico

### Frontend / Mobile
| Tecnología | Versión | Propósito |
|---|---|---|
| Expo | ^55.0.15 | Framework base para web y móvil |
| React Native | 0.83.4 | UI nativa iOS/Android |
| React Native Web | ^0.21.0 | Renderizado en navegador |
| Expo Router | ~55.0.12 | Navegación file-based (web + móvil) |
| NativeWind | ^2.0.11 | Estilos con sintaxis Tailwind para RN |
| Tailwind CSS | 3.3.2 | Base de utilidades de estilos |
| React Query | ^5 | Fetching, caché y sincronización de datos |
| React Hook Form | ^7 | Manejo de formularios |
| Zod | ^3 | Validación de esquemas |
| Victory Native | ^40 | Gráficas compatibles con RN y web |

> Zustand fue removido del stack — el estado de UI se maneja localmente con `useState` en cada pantalla. No se identificó necesidad de estado global en fase 1.

### Backend
| Tecnología | Versión | Propósito |
|---|---|---|
| Node.js | 20 LTS | Runtime |
| Express | ^4 | Framework HTTP |
| Prisma | ^5 | ORM y migraciones |
| PostgreSQL | 16 | Base de datos relacional |
| Zod | ^3 | Validación de request bodies |
| cors | ^2 | Manejo de CORS |
| dotenv | ^16 | Variables de entorno |
| tsx | ^4 | Ejecución TypeScript en desarrollo |

---

## 2. Estructura del Proyecto

```
finanzas/
├── app/                          # Expo Router — SOLO rutas navegables
│   ├── _layout.tsx               # Root layout + QueryClientProvider
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab navigator con íconos emoji
│   │   ├── index.tsx             # Dashboard
│   │   ├── movimientos.tsx       # Lista + filtros
│   │   ├── cuentas.tsx           # Lista de cuentas
│   │   ├── suscripciones.tsx     # Lista de suscripciones
│   │   └── metas.tsx             # Lista de metas
│   └── modals/
│       ├── nuevo-movimiento.tsx
│       ├── nueva-cuenta.tsx
│       ├── nueva-categoria.tsx
│       ├── nueva-suscripcion.tsx
│       └── nueva-meta.tsx
├── components/                   # Componentes reutilizables (NO son rutas)
│   └── ui/
│       ├── Button.tsx            # Botón con variantes y estado loading
│       ├── Input.tsx             # Input con label, error y hint
│       ├── Card.tsx              # Contenedor con borde y sombra
│       ├── ChipSelector.tsx      # Selector de opciones tipo chip/pill
│       ├── ConfirmDialog.tsx     # Modal de confirmación antes de eliminar
│       ├── EmptyState.tsx        # Estado vacío con CTA opcional
│       ├── SectionHeader.tsx     # Título de sección con acción opcional
│       └── Toast.tsx             # Notificación temporal de feedback
├── hooks/                        # Custom hooks
│   ├── useCuentas.ts
│   ├── useMovimientos.ts
│   ├── useCategorias.ts
│   ├── useSuscripciones.ts
│   ├── useMetas.ts
│   └── useToast.ts               # Estado y control del Toast
├── lib/
│   ├── api.ts                    # fetch wrapper con base URL
│   ├── queryClient.ts            # Instancia React Query
│   └── utils.ts                  # formatCurrency, formatDate, diasHasta, todayISO
├── types/
│   └── index.ts                  # Tipos TypeScript compartidos
├── assets/                       # Recursos estáticos
├── server/
│   ├── src/
│   │   ├── index.ts              # Entry point Express
│   │   ├── routes/
│   │   │   ├── cuentas.ts
│   │   │   ├── categorias.ts
│   │   │   ├── movimientos.ts
│   │   │   ├── suscripciones.ts
│   │   │   └── metas.ts
│   │   ├── middleware/
│   │   │   └── errorHandler.ts
│   │   ├── schemas/
│   │   │   └── index.ts          # Todos los schemas Zod
│   │   └── lib/
│   │       └── prisma.ts         # Instancia singleton PrismaClient
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
├── app.json
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

> Nota: `components/`, `hooks/`, `lib/` y `types/` viven fuera de `app/` intencionalmente. Expo Router convierte en ruta todo archivo dentro de `app/`. Los componentes fuera de esa carpeta son módulos React normales.

---

## 3. API REST

Base URL: `http://localhost:3000/api`

### Cuentas `/api/cuentas`
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/cuentas` | Listar todas las cuentas con saldo calculado |
| POST | `/api/cuentas` | Crear cuenta |
| PUT | `/api/cuentas/:id` | Editar cuenta |
| DELETE | `/api/cuentas/:id` | Eliminar cuenta (falla si tiene movimientos) |

### Categorías `/api/categorias`
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/categorias?tipo=gasto` | Listar categorías (filtro opcional por tipo) |
| POST | `/api/categorias` | Crear categoría |
| PUT | `/api/categorias/:id` | Editar categoría |
| DELETE | `/api/categorias/:id` | Eliminar categoría (falla si tiene dependencias) |

### Movimientos `/api/movimientos`
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/movimientos` | Listar con filtros y paginación |
| GET | `/api/movimientos/resumen` | Resumen del mes + historial 6 meses + gastos por categoría |
| GET | `/api/movimientos/:id` | Obtener movimiento por ID |
| POST | `/api/movimientos` | Crear movimiento |
| PUT | `/api/movimientos/:id` | Editar movimiento |
| DELETE | `/api/movimientos/:id` | Eliminar movimiento |

### Suscripciones `/api/suscripciones`
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/suscripciones` | Listar suscripciones ordenadas por próximo cobro |
| POST | `/api/suscripciones` | Crear suscripción |
| PUT | `/api/suscripciones/:id` | Editar suscripción |
| PATCH | `/api/suscripciones/:id/toggle` | Activar/desactivar |
| DELETE | `/api/suscripciones/:id` | Eliminar suscripción |

### Metas `/api/metas`
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/metas` | Listar metas con aportaciones |
| POST | `/api/metas` | Crear meta |
| PUT | `/api/metas/:id` | Editar meta |
| POST | `/api/metas/:id/aportacion` | Registrar aportación (actualiza monto_actual y completada) |
| DELETE | `/api/metas/:id` | Eliminar meta (cascade en aportaciones) |

---

## 4. Convenciones

### Respuestas de la API
```json
// Éxito
{ "data": { ... }, "message": "ok" }

// Error
{ "error": "Descripción del error", "code": "ERROR_CODE" }
```

### Paginación (movimientos)
```
GET /api/movimientos?page=1&limit=20&cuentaId=1&tipo=gasto&desde=2024-01-01&hasta=2024-12-31&q=uber
```

### Códigos de error comunes
| Código | HTTP | Descripción |
|---|---|---|
| NOT_FOUND | 404 | Recurso no encontrado |
| VALIDATION_ERROR | 400 | Datos inválidos (detalle por campo) |
| HAS_DEPENDENCIES | 409 | No se puede eliminar, tiene registros asociados |
| DUPLICATE | 409 | Ya existe un registro con esos datos |
| INTERNAL_ERROR | 500 | Error interno del servidor |

---

## 5. Variables de Entorno

### server/.env
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/finanzas"
PORT=3000
NODE_ENV=development
```

### .env (raíz, opcional)
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

> En dispositivo físico cambiar `localhost` por la IP local de la máquina.

---

## 6. Componentes UI

Todos los componentes viven en `components/ui/` y están construidos sobre primitivos de React Native con clases NativeWind.

| Componente | Descripción |
|---|---|
| `Button` | Variantes: primary, secondary, danger, ghost. Soporta estado `loading` con spinner. |
| `Input` | TextInput con label, mensaje de error inline y hint descriptivo. |
| `Card` | Contenedor con fondo blanco, borde gris y sombra sutil. |
| `ChipSelector` | Selector de opciones múltiples tipo chip. Soporta scroll horizontal y deselección (`nullable`). |
| `ConfirmDialog` | Modal de confirmación con variante `danger` para acciones destructivas. |
| `EmptyState` | Pantalla vacía con ícono, título, descripción y CTA opcional. |
| `SectionHeader` | Título de sección con acción secundaria alineada a la derecha. |
| `Toast` | Notificación temporal (2.5s) con tipos: success, error, info. |

---

## 7. Decisiones de Diseño

- **Sin autenticación en fase 1:** todos los endpoints son públicos, se asume un solo usuario
- **Saldo calculado dinámicamente:** el saldo de cada cuenta se recalcula en cada consulta (saldo_inicial + movimientos) para garantizar consistencia
- **NativeWind v2 sobre v4:** v4 requiere `react-native-worklets` que genera conflictos con Expo SDK 55; v2 es estable con el stack actual
- **Sin Zustand en fase 1:** el estado de UI (modales, confirmaciones, toasts) se maneja localmente con `useState`; se agregará si surge necesidad de estado compartido entre pantallas
- **Moneda por cuenta:** cada cuenta tiene su propia moneda, sin conversión entre ellas en fase 1
- **Timestamps UTC:** fechas almacenadas en UTC, conversión a zona horaria local en el cliente con `Intl.DateTimeFormat`
- **Confirmación antes de eliminar:** todas las acciones destructivas pasan por `ConfirmDialog` para evitar eliminaciones accidentales
