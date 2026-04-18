# FinanzasApp

App de finanzas personales — Expo (web + móvil) + Node.js + PostgreSQL.

## Requisitos

- Node.js 20+
- PostgreSQL 16 (o Docker)
- Expo Go en tu dispositivo móvil (para desarrollo)

## Setup

### 1. Base de datos

```bash
# Con Docker
docker run --name finanzas-db \
  -e POSTGRES_PASSWORD=Bmas.aguilar.2026-1 \
  -e POSTGRES_DB=finanzas \
  -p 5432:5432 -d postgres:16
```

### 2. Servidor

```bash
cd server
npm install
cp .env.example .env   # ajusta DATABASE_URL si es necesario
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
npm run dev            # corre en http://localhost:3000
```

### 3. Cliente

```bash
# en la raíz del proyecto
npm install
npx expo start
```

- Web: `w` en la terminal o abre http://localhost:8081
- iOS/Android: escanea el QR con Expo Go

## Variables de entorno

### server/.env
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/finanzas"
PORT=3000
```

### .env (raíz, opcional)
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

> En dispositivo físico cambia `localhost` por la IP de tu máquina en la red local.
