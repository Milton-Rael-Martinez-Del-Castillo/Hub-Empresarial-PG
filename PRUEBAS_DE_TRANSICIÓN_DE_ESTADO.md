# PRUEBAS DE TRANSICIÓN DE ESTADO

> **ESTADO: PENDIENTE DE EJECUCIÓN.** Documento preparado para completar otro día.
> Numeral de apéndice en la tesis: por confirmar (los existentes son APÉNDICE Nº 3 = unitarias, APÉNDICE Nº 4 = integración).

## 1. Objetivo

Verificar que el sistema respeta las reglas de estado de sus entidades: que las transiciones **válidas** se aplican y quedan reflejadas en la base de datos y en la interfaz, y que las transiciones **inválidas o no autorizadas** son rechazadas por el backend (nunca solo ocultas en la UI).

Las transiciones se prueban sobre la lógica real del proyecto (campo `status` de la tabla `assignamet` y campo `phase` de la fase del proceso de incubación), no sobre un modelo genérico.

## 2. Estados reales del proyecto (verificados en el código)

Los estados no se inventan para la prueba: se tomaron del código fuente.

**Módulo Incuvalab** — `Incuvalab/BackendIncuvalab/src/controllers/assignmentController.js`

| Entidad | Campo | Valores | Fuente en el código |
|---|---|---|---|
| Asignación (tarea de mentoría) | `assignamet.status` | `0` = desactivada/eliminada · `1` = pendiente (activa) · `2` = entregada | `status = 0` en línea 274 · `status = 2` en línea 344 · filtros `status IN (1, 2)` en líneas 32 y 333 |
| Fase del proceso | `assignamet.phase` | `1` = Preincubación · `2` = Incubación · `3` = Lanzamiento | `phaseMap` en líneas 38-42, 302-306 y 424-428 |
| Archivo de entrega | `file.status` | `0` = eliminado (soft delete) · `1` = activo | líneas 126 y 144 |

**Módulo Hub Empresarial** — sesión del administrador

| Entidad | Campo | Valores | Fuente en el código |
|---|---|---|---|
| Sesión | `hub_token` (localStorage) | presente = autenticado · ausente = no autenticado | `ProtectedAdmin` / `hubApi` (Hub-Frontend) |

## 3. Herramientas elegidas y por qué

No se requiere instalar ninguna librería nueva: las tres herramientas ya existen en el proyecto.

| Capa probada | Herramienta | Dónde | Por qué es la adecuada para este proyecto |
|---|---|---|---|
| Regla de negocio (servicio/controlador) | **Jest** (unitarias) | `Incuvalab-Backend` | Valida la transición sin base de datos ni navegador; es la prueba más estable y rápida. |
| Regla vía HTTP + permisos | **Jest + Supertest** (ya usado en los backends) | `Incuvalab-Backend` | Comprueba que el endpoint aplica la transición y que el middleware de rol la restringe (403/404). |
| Reflejo en la interfaz (evidencia) | **Playwright** (ya usado en Hub-Frontend) | `Hub-Frontend` | Solo para documentar con capturas que la UI muestra el nuevo estado. No se duplica la regla de negocio. |

**Decisión de diseño:** la regla de transición se prueba en el backend (Jest + Supertest); Playwright se usa únicamente como evidencia visual para las figuras de la tesis. Así las pruebas no se rompen cuando cambia un texto o un color de la interfaz.

## 4. Casos de prueba previstos

Cada fila se completará con el resultado real el día de la ejecución.

| ID | Capa | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|---|
| CP-TE-01 | Jest (controlador) | Transición válida de tarea: `Pendiente → Entregada` (Emprendedor entrega). | 1. Simular una asignación con `status = 1` del Emprendedor autenticado. 2. Invocar `deliverAssignment` con un archivo. | Se ejecuta `UPDATE assignamet SET status = 2` (línea 344) dentro de la transacción; responde 200 y la asignación queda en estado entregada. | — |
| CP-TE-02 | Jest (controlador) | La entrega repetida no rompe el estado. | 1. Entregar una asignación que ya está en `status = 2`. 2. Adjuntar un archivo adicional. | La consulta `status IN (1, 2)` (línea 333) permite la operación; el archivo nuevo se inserta con `file.status = 1` sin duplicar la asignación. | — |
| CP-TE-03 | Jest + Supertest (API) | El Emprendedor no puede entregar una tarea ajena. | 1. Autenticarse como Emprendedor A. 2. Enviar `POST /api/assignments/:id/deliver` con el id de una asignación de otro Emprendedor. | Responde HTTP 404 "Asignación no encontrada" (línea 339) y la asignación conserva su estado original. | — |
| CP-TE-04 | Jest + Supertest (API) | Transición no autorizada: el rol Emprendedor intenta reasignar/eliminar una asignación. | 1. Autenticarse con rol Emprendedor. 2. Intentar `PUT /api/assignments/:id` o la ruta de desactivación. | El middleware de rol (o el filtro `mentor_id = req.user.id`, línea 106) impide la operación; responde 403/404 y no se ejecuta ningún `UPDATE`. | — |
| CP-TE-05 | Jest (controlador) | Fase inválida: se envía una fase fuera del catálogo {1,2,3}. | 1. Crear/editar una asignación con `phase = 4` o `phase = 99`. 2. Consultar la asignación con `GET /api/assignments/:id`. | El `phaseMap` no resuelve el valor (línea 46: `phaseMap[row.phase] || row.phase`), por lo que la fase se devuelve tal cual; se documenta como observación de la prueba. | — |
| CP-TE-06 | Playwright (E2E, evidencia) | La interfaz refleja la transición `Pendiente → Entregada`. | 1. Abrir `/mis-tareas` como Emprendedor. 2. Adjantar un archivo y entregar. 3. Iniciar sesión como Mentor y abrir sus asignaciones. | La tarea deja de mostrarse como pendiente y aparece como entregada con su archivo, tanto en la vista del Emprendedor como en la del Mentor. | — |
| CP-TE-07 | Playwright (E2E, evidencia) | La fase se muestra como texto, no como número. | 1. Abrir las asignaciones de una fase cualquiera. 2. Observar la etiqueta de fase en pantalla. | Se muestra "Preincubación", "Incubación" o "Lanzamiento" (no `1`, `2`, `3`). | — |
| CP-TE-08 | Playwright (E2E, evidencia) | Transición de sesión: no autenticado → autenticado → cerrada. | 1. Abrir `/admin` sin sesión. 2. Iniciar sesión como administrador. 3. Cerrar sesión. | Sin `hub_token` redirige a `/admin/login`; con token carga el panel; tras cerrar sesión vuelve al estado no autenticado. | — |

## 5. Nota importante sobre las fases del proyecto

A diferencia de un ejemplo genérico, **este proyecto no tiene una máquina de estados que avance un proyecto de "Preincubación" a "Incubación" mediante un botón**. La fase (`phase`) es un dato que el Mentor selecciona al crear o editar una asignación; el sistema la valida solo por pertenencia al catálogo {1, Preincubación; 2, Incubación; 3, Lanzamiento} y la convierte a texto en la respuesta.

Por lo tanto, el caso "transición de fases Preincubación → Incubación" **no debe documentarse** en la tesis. Los casos CP-TE-01 a CP-TE-04 cubren la transición de estado que sí existe y está implementada (`status` de la asignación), que es la que tiene control de concurrencia (`getConnection`, `beginTransaction`, `rollback`), validación de pertenencia y verificación de rol.

## 6. Tareas pendientes (para otro día)

- [ ] Confirmar las rutas exactas en `Incuvalab/BackendIncuvalab/src/routes/` (`/api/assignments/:id/deliver`, etc.).
- [ ] Verificar si ya existe un archivo `tests/assignment.test.js` en `Incuvalab-Backend`; si no, crearlo.
- [ ] Escribir las pruebas unitarias de `deliverAssignment` (CP-TE-01, CP-TE-02, CP-TE-05) en `Incuvalab-Backend/tests/`.
- [ ] Escribir las pruebas de API con Supertest (CP-TE-03, CP-TE-04).
- [ ] Levantar los servicios (Hub 8080/8083, Incuvalab 8081/8000, MySQL) y ejecutar `npm test` en `Incuvalab-Backend`; anotar el resultado.
- [ ] Crear `Hub-Frontend/tests/state-transitions.spec.ts` con los casos CP-TE-06 a CP-TE-08.
- [ ] Ejecutar `npm run test:e2e` y capturar el reporte.
- [ ] Completar la columna "Éxito / Fracaso" de la sección 4 y el resumen final.

## 7. Comandos de ejecución

```bash
# Regla de negocio y API (Incuvalab-Backend)
cd Incuvalab/BackendIncuvalab
npm test

# Evidencia visual (Hub-Frontend, requiere servicios levantados)
cd Hub-Frontend
npm run test:e2e
npx playwright show-report
```

## 8. Dónde ver los resultados

| Recurso | Ruta |
|---|---|
| Reporte HTML de Playwright | `Hub-Frontend/playwright-report/index.html` (se abre con doble clic o con `npx playwright show-report`) |
| Trazas, capturas y vídeos por prueba | `Hub-Frontend/test-results/` |
| Salida de Jest | consola de `Incuvalab/BackendIncuvalab` al ejecutar `npm test` |

Para la tesis, las **figuras** se toman del reporte HTML de Playwright (resumen general y detalle de casos), y los **resultados de las pruebas de backend** se documentan en la tabla de la sección 4.

## 9. Resumen de resultados

| Resultado | Cantidad de casos |
|---|---|
| Éxito | — |
| Fracaso | — |
| **Total** | **8** |