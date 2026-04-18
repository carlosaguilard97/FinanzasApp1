# Especificación Funcional — FinanzasApp

## 1. Descripción General

FinanzasApp es una aplicación de finanzas personales que permite registrar ingresos y gastos, gestionar múltiples cuentas, categorizar movimientos, controlar suscripciones y establecer metas de ahorro. Disponible en web y móvil desde una sola codebase.

---

## 2. Módulos

### 2.1 Cuentas

Permite al usuario gestionar distintas fuentes de dinero.

**Funcionalidades:**
- Crear cuenta con nombre, tipo (efectivo, banco, tarjeta de crédito, tarjeta de débito, inversión, otro), moneda y saldo inicial
- Editar nombre, tipo y moneda de una cuenta
- Eliminar cuenta (solo si no tiene movimientos asociados)
- Ver saldo actual calculado (saldo inicial + ingresos - gastos)
- Listar todas las cuentas con su saldo actual

**Tipos de cuenta:**
- Efectivo
- Banco (cuenta de cheques/ahorro)
- Tarjeta de débito
- Tarjeta de crédito
- Inversión
- Otro

---

### 2.2 Categorías

Permite clasificar los movimientos por tipo de gasto o ingreso.

**Funcionalidades:**
- Crear categoría con nombre, tipo (ingreso/gasto), color e ícono
- Editar categoría
- Eliminar categoría (solo si no tiene movimientos asociados)
- Listar categorías filtradas por tipo

**Categorías predeterminadas (gasto):**
Alimentación, Transporte, Entretenimiento, Salud, Educación, Ropa, Hogar, Servicios, Suscripciones, Otros

**Categorías predeterminadas (ingreso):**
Salario, Freelance, Inversiones, Regalo, Otros

---

### 2.3 Movimientos

Núcleo de la aplicación. Registra cada transacción financiera.

**Funcionalidades:**
- Registrar movimiento con: tipo (ingreso/gasto), monto, cuenta, categoría, fecha, descripción/notas
- Editar movimiento
- Eliminar movimiento
- Listar movimientos con filtros por: cuenta, categoría, tipo, rango de fechas
- Búsqueda por descripción
- Paginación de resultados

**Reglas de negocio:**
- El monto debe ser mayor a 0
- La fecha no puede ser futura (configurable)
- Al registrar un movimiento se actualiza el saldo de la cuenta automáticamente
- Al editar o eliminar un movimiento se recalcula el saldo de la cuenta

---

### 2.4 Suscripciones

Control de pagos recurrentes.

**Funcionalidades:**
- Registrar suscripción con: nombre, monto, frecuencia (mensual, anual, semanal), fecha de próximo cobro, categoría, cuenta asociada, notas
- Editar suscripción
- Eliminar suscripción
- Marcar suscripción como activa/inactiva
- Listar suscripciones con su estado y próxima fecha de cobro
- Ver total mensual de suscripciones activas

---

### 2.5 Metas de Ahorro

Permite definir objetivos financieros.

**Funcionalidades:**
- Crear meta con: nombre, monto objetivo, monto actual, fecha límite (opcional), cuenta asociada (opcional), notas
- Editar meta
- Eliminar meta
- Registrar aportación a una meta (incrementa monto actual)
- Ver progreso de cada meta (porcentaje completado)
- Listar metas activas y completadas

---

### 2.6 Dashboard

Vista principal con resumen financiero.

**Funcionalidades:**
- Balance total (suma de todas las cuentas)
- Ingresos del mes actual
- Gastos del mes actual
- Diferencia (ahorro neto del mes)
- Gráfica de gastos por categoría (pie chart)
- Gráfica de ingresos vs gastos por mes (bar chart, últimos 6 meses)
- Últimos 5 movimientos registrados
- Suscripciones próximas a vencer (próximos 7 días)
- Progreso de metas de ahorro activas

---

## 3. Restricciones de Fase 1

- Sin autenticación de usuarios (un solo usuario implícito)
- Sin importación/exportación de datos
- Sin notificaciones push
- Sin sincronización con bancos (Open Banking)
- Captura manual de movimientos únicamente

---

## 4. Flujos Principales

### Registrar un movimiento
1. Usuario accede a la sección Movimientos
2. Presiona "Nuevo movimiento"
3. Selecciona tipo (ingreso/gasto)
4. Ingresa monto
5. Selecciona cuenta
6. Selecciona categoría
7. Confirma o modifica la fecha
8. Agrega descripción (opcional)
9. Guarda el movimiento
10. El sistema actualiza el saldo de la cuenta

### Crear una cuenta
1. Usuario accede a Cuentas
2. Presiona "Nueva cuenta"
3. Ingresa nombre, tipo, moneda y saldo inicial
4. Guarda
5. La cuenta aparece en el listado y en el selector de movimientos

### Registrar una suscripción
1. Usuario accede a Suscripciones
2. Presiona "Nueva suscripción"
3. Ingresa nombre, monto, frecuencia, fecha de próximo cobro
4. Selecciona categoría y cuenta (opcional)
5. Guarda
6. La suscripción aparece en el listado y en el dashboard si vence pronto
