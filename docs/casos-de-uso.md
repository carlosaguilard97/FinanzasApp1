# Casos de Uso — FinanzasApp

## Actores
- **Usuario:** único actor en fase 1 (sin autenticación)

---

## CU-01: Gestión de Cuentas

### CU-01.1 Crear Cuenta
- **Actor:** Usuario
- **Precondición:** Ninguna
- **Flujo principal:**
  1. Usuario navega a la sección Cuentas
  2. Presiona "Nueva cuenta"
  3. Ingresa nombre (requerido), tipo (requerido), moneda (default: MXN), saldo inicial (default: 0)
  4. Confirma el formulario
  5. El sistema guarda la cuenta y actualiza el listado
- **Flujo alternativo — datos inválidos:**
  - 4a. El sistema muestra errores de validación en los campos correspondientes
  - 4b. El usuario corrige y reintenta
- **Postcondición:** La cuenta aparece en el listado y está disponible para asociar movimientos

### CU-01.2 Editar Cuenta
- **Actor:** Usuario
- **Precondición:** Existe al menos una cuenta
- **Flujo principal:**
  1. Usuario selecciona una cuenta del listado
  2. Presiona "Editar"
  3. Modifica los campos deseados (nombre, tipo, moneda)
  4. Guarda los cambios
- **Restricción:** No se puede modificar el saldo inicial directamente; se refleja a través de movimientos
- **Postcondición:** Los datos de la cuenta se actualizan

### CU-01.3 Eliminar Cuenta
- **Actor:** Usuario
- **Precondición:** La cuenta no tiene movimientos asociados
- **Flujo principal:**
  1. Usuario selecciona una cuenta
  2. Presiona "Eliminar"
  3. El sistema solicita confirmación
  4. Usuario confirma
  5. La cuenta se elimina
- **Flujo alternativo — cuenta con movimientos:**
  - 5a. El sistema muestra error: "No se puede eliminar una cuenta con movimientos registrados"
- **Postcondición:** La cuenta desaparece del listado

---

## CU-02: Gestión de Categorías

### CU-02.1 Crear Categoría
- **Actor:** Usuario
- **Precondición:** Ninguna
- **Flujo principal:**
  1. Usuario navega a Categorías (desde configuración o al crear un movimiento)
  2. Presiona "Nueva categoría"
  3. Ingresa nombre, selecciona tipo (ingreso/gasto), elige color e ícono
  4. Guarda
- **Postcondición:** La categoría está disponible al registrar movimientos

### CU-02.2 Editar Categoría
- **Flujo principal:** Similar a CU-01.2

### CU-02.3 Eliminar Categoría
- **Precondición:** La categoría no tiene movimientos ni suscripciones asociadas
- **Flujo alternativo:** El sistema bloquea la eliminación si tiene dependencias

---

## CU-03: Gestión de Movimientos

### CU-03.1 Registrar Movimiento
- **Actor:** Usuario
- **Precondición:** Existe al menos una cuenta y una categoría
- **Flujo principal:**
  1. Usuario presiona "Nuevo movimiento" (desde Dashboard o sección Movimientos)
  2. Selecciona tipo: ingreso o gasto
  3. Ingresa monto (mayor a 0)
  4. Selecciona cuenta
  5. Selecciona categoría (filtrada por tipo)
  6. Confirma o modifica la fecha (default: hoy)
  7. Agrega descripción (opcional)
  8. Guarda
  9. El sistema actualiza el saldo de la cuenta
- **Flujo alternativo — monto inválido:**
  - 3a. El sistema muestra "El monto debe ser mayor a 0"
- **Postcondición:** El movimiento aparece en el historial y el saldo de la cuenta se actualiza

### CU-03.2 Editar Movimiento
- **Actor:** Usuario
- **Precondición:** Existe el movimiento
- **Flujo principal:**
  1. Usuario localiza el movimiento en el historial
  2. Presiona "Editar"
  3. Modifica los campos deseados
  4. Guarda
  5. El sistema recalcula el saldo de la cuenta afectada
- **Caso especial:** Si se cambia la cuenta, el sistema actualiza el saldo de ambas cuentas (la anterior y la nueva)

### CU-03.3 Eliminar Movimiento
- **Flujo principal:**
  1. Usuario selecciona el movimiento
  2. Presiona "Eliminar"
  3. Confirma la acción
  4. El sistema elimina el movimiento y recalcula el saldo de la cuenta

### CU-03.4 Filtrar Movimientos
- **Actor:** Usuario
- **Flujo principal:**
  1. Usuario accede a la sección Movimientos
  2. Aplica uno o más filtros: cuenta, categoría, tipo, rango de fechas
  3. El sistema muestra los movimientos que coinciden
  4. Usuario puede limpiar filtros para ver todos

---

## CU-04: Gestión de Suscripciones

### CU-04.1 Registrar Suscripción
- **Actor:** Usuario
- **Precondición:** Ninguna
- **Flujo principal:**
  1. Usuario navega a Suscripciones
  2. Presiona "Nueva suscripción"
  3. Ingresa nombre, monto, frecuencia (mensual/anual/semanal)
  4. Ingresa fecha de próximo cobro
  5. Selecciona categoría y cuenta (opcionales)
  6. Agrega notas (opcional)
  7. Guarda
- **Postcondición:** La suscripción aparece en el listado y en el dashboard si vence pronto

### CU-04.2 Activar / Desactivar Suscripción
- **Flujo principal:**
  1. Usuario presiona el toggle de estado en la suscripción
  2. El sistema cambia el estado activo/inactivo
  3. Las suscripciones inactivas no se contabilizan en el total mensual

### CU-04.3 Editar / Eliminar Suscripción
- Flujo estándar similar a CU-01.2 y CU-01.3

---

## CU-05: Gestión de Metas de Ahorro

### CU-05.1 Crear Meta
- **Actor:** Usuario
- **Precondición:** Ninguna
- **Flujo principal:**
  1. Usuario navega a Metas
  2. Presiona "Nueva meta"
  3. Ingresa nombre, monto objetivo
  4. Ingresa fecha límite (opcional)
  5. Asocia una cuenta (opcional)
  6. Agrega notas (opcional)
  7. Guarda con monto actual = 0
- **Postcondición:** La meta aparece en el listado con 0% de progreso

### CU-05.2 Registrar Aportación
- **Actor:** Usuario
- **Precondición:** Existe la meta y no está completada
- **Flujo principal:**
  1. Usuario selecciona una meta
  2. Presiona "Agregar aportación"
  3. Ingresa el monto a aportar
  4. Guarda
  5. El sistema incrementa el monto actual de la meta
  6. Si el monto actual >= monto objetivo, la meta se marca como completada
- **Postcondición:** El progreso de la meta se actualiza

### CU-05.3 Editar / Eliminar Meta
- Flujo estándar

---

## CU-06: Consultar Dashboard

- **Actor:** Usuario
- **Precondición:** Ninguna (puede estar vacío si no hay datos)
- **Flujo principal:**
  1. Usuario abre la aplicación
  2. El sistema muestra:
     - Balance total de todas las cuentas
     - Ingresos y gastos del mes actual
     - Ahorro neto del mes
     - Gráfica de gastos por categoría
     - Gráfica de ingresos vs gastos (últimos 6 meses)
     - Últimos 5 movimientos
     - Suscripciones que vencen en los próximos 7 días
     - Progreso de metas activas
