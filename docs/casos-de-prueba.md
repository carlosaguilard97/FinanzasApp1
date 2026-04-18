# Casos de Prueba — FinanzasApp

## Convenciones
- **CP:** Caso de Prueba
- **Resultado Esperado (RE)**
- **Tipo:** Funcional (F), Borde (B), Negativo (N)

---

## Módulo: Cuentas

| ID | Tipo | Descripción | Datos de entrada | RE |
|---|---|---|---|---|
| CP-CU-01 | F | Crear cuenta válida | nombre: "BBVA", tipo: "banco", moneda: "MXN", saldo_inicial: 5000 | Cuenta creada, aparece en listado con saldo 5000 |
| CP-CU-02 | N | Crear cuenta sin nombre | nombre: "", tipo: "banco" | Error: "El nombre es requerido" |
| CP-CU-03 | N | Crear cuenta sin tipo | nombre: "Efectivo", tipo: "" | Error: "El tipo es requerido" |
| CP-CU-04 | B | Crear cuenta con saldo inicial 0 | nombre: "Nueva", tipo: "efectivo", saldo_inicial: 0 | Cuenta creada con saldo 0 |
| CP-CU-05 | N | Crear cuenta con saldo negativo | saldo_inicial: -100 | Error: "El saldo inicial no puede ser negativo" |
| CP-CU-06 | F | Editar nombre de cuenta | Cambiar "BBVA" por "BBVA Nómina" | Nombre actualizado en listado |
| CP-CU-07 | F | Eliminar cuenta sin movimientos | Cuenta vacía | Cuenta eliminada del listado |
| CP-CU-08 | N | Eliminar cuenta con movimientos | Cuenta con 3 movimientos | Error: "No se puede eliminar una cuenta con movimientos registrados" |
| CP-CU-09 | F | Saldo calculado correctamente | Saldo inicial: 1000, ingreso: 500, gasto: 200 | Saldo mostrado: 1300 |

---

## Módulo: Categorías

| ID | Tipo | Descripción | Datos de entrada | RE |
|---|---|---|---|---|
| CP-CAT-01 | F | Crear categoría de gasto | nombre: "Gym", tipo: "gasto", color: "#FF5733" | Categoría creada y disponible en selector de movimientos |
| CP-CAT-02 | N | Crear categoría sin nombre | nombre: "" | Error: "El nombre es requerido" |
| CP-CAT-03 | F | Filtrar categorías por tipo | tipo: "ingreso" | Solo se muestran categorías de ingreso |
| CP-CAT-04 | N | Eliminar categoría con movimientos | Categoría con movimientos asociados | Error: "No se puede eliminar, tiene movimientos asociados" |
| CP-CAT-05 | F | Eliminar categoría sin dependencias | Categoría sin movimientos | Categoría eliminada |

---

## Módulo: Movimientos

| ID | Tipo | Descripción | Datos de entrada | RE |
|---|---|---|---|---|
| CP-MOV-01 | F | Registrar gasto válido | tipo: "gasto", monto: 150, cuenta: "BBVA", categoría: "Alimentación", fecha: hoy | Movimiento registrado, saldo de cuenta disminuye 150 |
| CP-MOV-02 | F | Registrar ingreso válido | tipo: "ingreso", monto: 10000, cuenta: "BBVA", categoría: "Salario" | Movimiento registrado, saldo de cuenta aumenta 10000 |
| CP-MOV-03 | N | Registrar movimiento con monto 0 | monto: 0 | Error: "El monto debe ser mayor a 0" |
| CP-MOV-04 | N | Registrar movimiento con monto negativo | monto: -50 | Error: "El monto debe ser mayor a 0" |
| CP-MOV-05 | N | Registrar movimiento sin cuenta | cuenta: null | Error: "La cuenta es requerida" |
| CP-MOV-06 | N | Registrar movimiento sin categoría | categoría: null | Error: "La categoría es requerida" |
| CP-MOV-07 | F | Editar monto de movimiento | Cambiar monto de 150 a 200 | Saldo de cuenta recalculado correctamente |
| CP-MOV-08 | F | Editar cuenta de movimiento | Mover gasto de cuenta A a cuenta B | Saldo de cuenta A aumenta, saldo de cuenta B disminuye |
| CP-MOV-09 | F | Eliminar movimiento | Gasto de 300 eliminado | Saldo de cuenta aumenta 300 |
| CP-MOV-10 | F | Filtrar por cuenta | Filtro: cuenta "BBVA" | Solo movimientos de BBVA |
| CP-MOV-11 | F | Filtrar por tipo | Filtro: tipo "gasto" | Solo gastos |
| CP-MOV-12 | F | Filtrar por rango de fechas | desde: 2024-01-01, hasta: 2024-01-31 | Solo movimientos de enero 2024 |
| CP-MOV-13 | F | Filtrar por categoría | Filtro: "Alimentación" | Solo movimientos de esa categoría |
| CP-MOV-14 | B | Registrar movimiento con descripción vacía | descripción: "" | Movimiento registrado sin descripción (campo opcional) |
| CP-MOV-15 | B | Paginación de movimientos | 25 movimientos, limit: 20 | Primera página: 20 registros, segunda página: 5 registros |

---

## Módulo: Suscripciones

| ID | Tipo | Descripción | Datos de entrada | RE |
|---|---|---|---|---|
| CP-SUB-01 | F | Crear suscripción mensual | nombre: "Netflix", monto: 219, frecuencia: "mensual", próximo_cobro: 2024-02-15 | Suscripción creada y visible en listado |
| CP-SUB-02 | N | Crear suscripción sin nombre | nombre: "" | Error: "El nombre es requerido" |
| CP-SUB-03 | N | Crear suscripción con monto 0 | monto: 0 | Error: "El monto debe ser mayor a 0" |
| CP-SUB-04 | F | Desactivar suscripción | Toggle a inactivo | Suscripción marcada como inactiva, no se suma al total mensual |
| CP-SUB-05 | F | Total mensual de suscripciones activas | 3 suscripciones activas: 219 + 99 + 149 | Total mostrado: 467 |
| CP-SUB-06 | F | Suscripción próxima a vencer aparece en dashboard | próximo_cobro: en 3 días | Aparece en sección "Próximos cobros" del dashboard |
| CP-SUB-07 | B | Suscripción que vence hoy | próximo_cobro: hoy | Aparece en dashboard con indicador de urgencia |

---

## Módulo: Metas de Ahorro

| ID | Tipo | Descripción | Datos de entrada | RE |
|---|---|---|---|---|
| CP-META-01 | F | Crear meta válida | nombre: "Vacaciones", objetivo: 15000 | Meta creada con 0% de progreso |
| CP-META-02 | N | Crear meta con objetivo 0 | objetivo: 0 | Error: "El monto objetivo debe ser mayor a 0" |
| CP-META-03 | F | Registrar aportación | meta: "Vacaciones", aportación: 2000 | Monto actual: 2000, progreso: 13.3% |
| CP-META-04 | F | Meta completada al 100% | aportación que lleva monto_actual >= objetivo | Meta marcada como completada |
| CP-META-05 | N | Aportación con monto 0 | monto: 0 | Error: "El monto debe ser mayor a 0" |
| CP-META-06 | B | Meta sin fecha límite | fecha_limite: null | Meta creada sin fecha, sin indicador de vencimiento |
| CP-META-07 | F | Progreso calculado correctamente | objetivo: 10000, aportaciones: 3000 + 2000 | Progreso: 50% |

---

## Módulo: Dashboard

| ID | Tipo | Descripción | RE |
|---|---|---|---|
| CP-DASH-01 | F | Balance total con múltiples cuentas | Suma correcta de saldos de todas las cuentas |
| CP-DASH-02 | F | Ingresos del mes actual | Solo ingresos del mes en curso |
| CP-DASH-03 | F | Gastos del mes actual | Solo gastos del mes en curso |
| CP-DASH-04 | F | Ahorro neto = ingresos - gastos | Cálculo correcto |
| CP-DASH-05 | B | Dashboard sin datos | Muestra valores en 0 y mensaje de bienvenida/vacío |
| CP-DASH-06 | F | Últimos 5 movimientos | Muestra los 5 más recientes ordenados por fecha desc |
| CP-DASH-07 | F | Suscripciones próximas (7 días) | Solo suscripciones activas con cobro en los próximos 7 días |

---

## Pruebas de API (Backend)

| ID | Método | Endpoint | Escenario | RE HTTP |
|---|---|---|---|---|
| CP-API-01 | GET | /api/cuentas | Listar cuentas | 200 + array |
| CP-API-02 | POST | /api/cuentas | Body válido | 201 + objeto creado |
| CP-API-03 | POST | /api/cuentas | Body inválido | 400 + mensaje de error |
| CP-API-04 | DELETE | /api/cuentas/:id | ID inexistente | 404 |
| CP-API-05 | DELETE | /api/cuentas/:id | Cuenta con movimientos | 409 |
| CP-API-06 | GET | /api/movimientos | Sin filtros | 200 + paginación |
| CP-API-07 | GET | /api/movimientos | Con filtros válidos | 200 + resultados filtrados |
| CP-API-08 | POST | /api/movimientos | Monto negativo | 400 |
| CP-API-09 | GET | /api/movimientos/resumen | Mes actual | 200 + totales correctos |
