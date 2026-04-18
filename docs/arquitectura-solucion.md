# Arquitectura de la Solución — FinanzasApp

## 1. Visión General

FinanzasApp es una aplicación de finanzas personales con una arquitectura cliente-servidor desacoplada. El cliente es una aplicación Expo que corre en web (navegador) y móvil (iOS/Android) desde una sola codebase. El servidor es una API REST en Node.js que persiste los datos en PostgreSQL.

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENTE                          │
│                                                         │
│   ┌─────────────┐    ┌─────────────┐                   │
│   │  Web (PWA)  │    │iOS / Android│                   │
│   │  Navegador  │    │   Expo Go   │                   │
│   └──────┬──────┘    └──────┬──────┘                   │
│          └────────┬─────────┘                           │
│              Expo + RN Web                              │
│           NativeWind | Expo Router                      │
│           React Query | Zustand                         │
└───────────────────┬─────────────────────────────────────┘
                    │ HTTP / REST
                    │ JSON
┌───────────────────▼─────────────────────────────────────┐
│                       SERVIDOR                          │
│                                                         │
│              Node.js + Express                          │
│              Validación con Zod                         │
│              Prisma ORM                                 │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│                    BASE DE DATOS                        │
│                     PostgreSQL                          │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Capas de la Solución

### Capa de Presentación (Cliente)
Responsable del UI y la experiencia de usuario. Construida con React Native + Expo Router, renderiza en web y móvil sin duplicar código.

- Expo Router maneja la navegación con un sistema file-based idéntico a Next.js
- NativeWind provee estilos con sintaxis Tailwind adaptados a React Native
- React Query maneja el estado del servidor: fetching, caché, revalidación y mutaciones
- Zustand maneja estado local de UI (filtros activos, modales abiertos, etc.)
- React Hook Form + Zod manejan formularios con validación en cliente

### Capa de API (Servidor)
API REST stateless que expone los recursos del dominio. Cada ruta valida el input con Zod antes de pasar al ORM.

- Express organiza las rutas por recurso (cuentas, movimientos, etc.)
- Middleware centralizado para manejo de errores
- Prisma genera queries type-safe y maneja migraciones de esquema

### Capa de Datos
PostgreSQL almacena todos los datos de forma relacional. Prisma actúa como interfaz entre el servidor y la base de datos.

---

## 3. Flujo de una Petición

```
Usuario llena formulario
        │
        ▼
React Hook Form valida en cliente (Zod)
        │
        ▼
React Query ejecuta mutación → fetch POST /api/movimientos
        │
        ▼
Express recibe request
        │
        ▼
Middleware valida body con Zod
        │
        ▼
Route handler llama a Prisma
        │
        ▼
Prisma ejecuta query en PostgreSQL
        │
        ▼
Respuesta JSON → React Query actualiza caché
        │
        ▼
UI se re-renderiza con datos actualizados
```

---

## 4. Estrategia de Caché (React Query)

| Recurso | staleTime | Estrategia |
|---|---|---|
| Cuentas | 5 min | Invalidar al crear/editar/eliminar cuenta o movimiento |
| Categorías | 10 min | Invalidar al crear/editar/eliminar categoría |
| Movimientos | 1 min | Invalidar al crear/editar/eliminar movimiento |
| Suscripciones | 5 min | Invalidar al crear/editar/eliminar suscripción |
| Metas | 5 min | Invalidar al crear/editar/aportar/eliminar meta |
| Dashboard | 1 min | Invalidar al cualquier cambio en movimientos o cuentas |

---

## 5. Manejo de Errores

### Cliente
- React Query captura errores de red y los expone al componente
- Componente muestra mensaje de error con opción de reintentar
- Errores de validación de formulario se muestran inline en cada campo

### Servidor
- Middleware `errorHandler` captura todos los errores no manejados
- Errores de Prisma se mapean a códigos HTTP apropiados
- Errores de validación Zod retornan 400 con detalle de campos inválidos

---

## 6. Consideraciones para Fase 2 (Auth)

La arquitectura está preparada para agregar autenticación sin cambios estructurales mayores:

- El servidor agrega middleware de autenticación JWT antes de las rutas protegidas
- Cada tabla en la DB agrega columna `userId` para multi-usuario
- El cliente agrega pantallas de login/registro y manejo de tokens
- React Query se configura para incluir el token en cada request
