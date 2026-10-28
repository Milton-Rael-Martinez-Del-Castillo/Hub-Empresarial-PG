# APÉNDICE Nº 4

# PRUEBAS DE INTEGRACIÓN

En las siguientes tablas, cada fila representa un caso de prueba de integración que verifica la comunicación entre dos o más componentes del sistema (frontend ↔ backend, API ↔ API de otros módulos, o flujos extremo a extremo entre módulos). La tabla incluye columnas para el número de caso de prueba, el escenario que se está probando, los pasos para realizar la prueba, el resultado esperado y el resultado real en forma de éxito/fracaso (si hubiera fracaso, entonces se detallará lo que sucedió).

**Componentes que participan en la integración:**

| Componente | Tecnología | Puerto |
|---|---|---|
| Hub-Frontend | React + TypeScript + Vite | 8080 |
| Hub-Backend | Node.js + Express 5 + MySQL | 8083 |
| Incuvalab-Frontend | React + Vite | 8081 |
| Incuvalab-Backend | Node.js + Express 5 + MySQL | 8000 |
| Crowdfunding-Frontend | React + Vite | 8082 |
| Crowdfunding-Backend | Node.js + Express 4 + MySQL | 4000 |

**Verificación automatizada (2026-09-24):**

- Las suites `npm test` de los backends (Jest + Supertest) verifican los flujos API frontend→backend descritos en este apéndice a nivel de rutas, controladores y modelos, con la capa de base de datos simulada: Hub-Backend 27/27 ✔ e Incuvalab-Backend 24/24 ✔.
- Los frontends incluyen pruebas de componente (Vitest + React Testing Library) que cubren la lógica de sesión y protección de rutas: Hub-Frontend 6/6 ✔ e Incuvalab-Frontend 12/12 ✔.
- El Hub-Frontend dispone además de pruebas E2E (Playwright) en `tests/*.spec.ts` (`admin-login`, `nae-solicitud`, `uma-solicitud`, `incuvalab-*`) que reproducen los flujos extremo a extremo de este apéndice contra los servicios levantados. Ejecutadas el **2026-09-24** con `npm run test:e2e` (Hub en :8080/:8083, Incuvalab en :8081/:8000 y MySQL activos): **20/20 ✔**. El spec `incuvalab-login` utiliza un administrador fijo (`admin@incuvalab.edu` / `Univalle1234!`) sembrado directamente en la base de datos, ya que el rol Administrador no se puede auto-registrar desde la API pública.

---

## 1. INTEGRACIÓN HUB-FRONTEND ↔ HUB-BACKEND (API REST, puerto 8083)

### Caso de Uso: Iniciar Sesión de Administrador y Cargar Panel

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Inicio de sesión admin → acceso al panel. | 1. Abrir el Hub (8080). 2. Navegar a `/admin/login`. 3. Ingresar credenciales de administrador y enviar. 4. Observar la redirección. | El frontend envía `POST /api/hub/login`, recibe el token, lo guarda en `hub_token` y redirige a `/admin` mostrando el panel con las pestañas Solicitudes NAE, UMA, Casos, Mentores y Proyectos. | Éxito |
| 2 | Acceso al panel sin token. | 1. Abrir directamente la ruta `/admin` sin haber iniciado sesión. | El componente `ProtectedAdmin` detecta que no hay sesión y redirige a `/admin/login`. | Éxito |
| 3 | Petición protegida sin token desde el panel. | 1. Abrir la consola del navegador. 2. Realizar una petición manual a `/api/nae/solicitudes` sin `Authorization`. | El backend responde HTTP 401 y el panel limpia la sesión y redirige a `/admin/login` (sesión vencida). | Éxito |
| 4 | Recarga del panel conservando la sesión. | 1. Iniciar sesión como admin. 2. Recargar la página `/admin`. | El token persiste en `hub_token`; el panel mantiene la sesión y carga las solicitudes. | Éxito |

### Caso de Uso: Enviar Solicitud de Asesoría NAE desde la Web

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Enviar solicitud desde el formulario NAE → aparece en el panel admin. | 1. Abrir `/nae`. 2. Completar el formulario "Solicitar Asesoría" con nombre y correo. 3. Enviar. 4. Iniciar sesión como admin y abrir el panel. 5. Observar la pestaña "Solicitudes NAE". | El frontend llama a `POST /api/nae/solicitudes`; el backend persiste el registro y responde 201; la solicitud aparece listada en el panel con su fecha. Éxito. | Éxito |
| 2 | Enviar solicitud con campos vacíos. | 1. Abrir `/nae`. 2. Dejar vacíos los campos del formulario. 3. Enviar. | El backend responde HTTP 400 "El nombre y el correo son obligatorios" y el frontend muestra el mensaje de error "Hubo un problema al enviar la solicitud". | Éxito |
| 3 | Eliminar solicitud NAE desde el panel. | 1. Estar en el panel, pestaña "Solicitudes NAE". 2. Pulsar "Eliminar" en una solicitud. 3. Confirmar. | El frontend llama a `DELETE /api/nae/solicitudes/:id`; el backend responde 200 y la fila desaparece de la tabla sin recargar. | Éxito |

### Caso de Uso: Enviar Solicitud de Desarrollo UMA desde la Web

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Enviar solicitud desde el formulario UMA → aparece en el panel admin. | 1. Abrir `/uma`. 2. Completar nombre, correo y mensaje. 3. Enviar. 4. Iniciar sesión como admin y abrir el panel. 5. Observar la pestaña "Solicitudes UMA". | El frontend llama a `POST /api/uma/solicitudes`; el backend persiste el registro (incluido el mensaje) y responde 201; la solicitud aparece en el panel. | Éxito |
| 2 | Eliminar solicitud UMA desde el panel. | 1. Estar en el panel, pestaña "Solicitudes UMA". 2. Pulsar "Eliminar". 3. Confirmar. | El frontend llama a `DELETE /api/uma/solicitudes/:id`; el backend responde 200 y la fila desaparece. | Éxito |

### Caso de Uso: Gestión de Casos de Éxito NAE (Panel ↔ Carrusel público)

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Crear caso desde el panel → aparece en el carrusel NAE público. | 1. Iniciar sesión como admin. 2. Pestaña "Casos de Éxito NAE" → "+ Nuevo caso". 3. Completar título y descripción. 4. Guardar. 5. Abrir `/nae` sin sesión. | El panel llama a `POST /api/nae/casos` (201); el carrusel público obtiene los casos vía `GET /api/nae/casos` y muestra la nueva tarjeta. | Éxito |
| 2 | Editar caso existente → se refleja en el carrusel. | 1. En el panel, pulsar "Editar" en un caso. 2. Cambiar el título. 3. Guardar. 4. Recargar `/nae`. | El frontend llama a `PUT /api/nae/casos/:id`; el carrusel público muestra el título actualizado. | Éxito |
| 3 | Eliminar caso → desaparece del carrusel. | 1. En el panel, pulsar "Eliminar" en un caso. 2. Confirmar. 3. Recargar `/nae`. | El frontend llama a `DELETE /api/nae/casos/:id`; la tarjeta deja de mostrarse en el carrusel. | Éxito |

---

## 2. INTEGRACIÓN HUB-BACKEND ↔ INCUVALAB-BACKEND (PROXY /api/hub/mentores)

**Descripción:** El Hub-Backend actúa como proxy de solo lectura hacia el Incuvalab-Backend (`GET /api/mentor`) para mostrar los mentores registrados en el panel de administración del Hub.

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Consultar mentores con Incuvalab disponible. | 1. Levantar Incuvalab-Backend (8000) y registrar mentores. 2. Iniciar sesión como admin en el Hub. 3. Abrir pestaña "Mentores (Incuvalab)". | El Hub-Backend consulta `http://localhost:8000/api/mentor`, normaliza la respuesta y devuelve HTTP 200 con el listado (nombre, teléfono, área, disponibilidad). El panel los muestra. | Éxito |
| 2 | Consultar mentores sin sesión. | 1. Llamar a `GET /api/hub/mentores` sin token. | El middleware devuelve HTTP 401 y no se entrega el listado. | Éxito |
| 3 | Incuvalab-Backend apagado. | 1. Detener Incuvalab-Backend. 2. En el panel, abrir la pestaña "Mentores (Incuvalab)". | El Hub-Backend responde HTTP 502 "No se pudieron obtener los mentores de Incuvalab" y el panel muestra el mensaje "No se pudo cargar las vistas de Incuvalab/Crowdfunding" sin romper la página. | Éxito |

---

## 3. INTEGRACIÓN HUB-BACKEND ↔ CROWDFUNDING-BACKEND (PROXY /api/hub/proyectos-crowdfunding)

**Descripción:** El Hub-Backend actúa como proxy de solo lectura hacia el Crowdfunding-Backend (`GET /api/proyectos/todos`) para mostrar los proyectos activos en el panel del Hub.

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Consultar proyectos con Crowdfunding disponible. | 1. Levantar Crowdfunding-Backend (4000) con proyectos registrados. 2. Iniciar sesión como admin en el Hub. 3. Abrir pestaña "Proyectos (Crowdfunding)". | El Hub-Backend consulta el Crowdfunding, mapea cada proyecto a `IdProyecto, Titulo, Categoria, DescripcionCorta, ImagenPrincipal, EstadoAprobacion, NombreCreador, ApellidoCreador` y devuelve HTTP 200. El panel los muestra con estado (Activo/Pendiente). | Éxito |
| 2 | Consultar proyectos sin sesión. | 1. Llamar a `GET /api/hub/proyectos-crowdfunding` sin token. | El middleware devuelve HTTP 401. | Éxito |
| 3 | Crowdfunding-Backend apagado. | 1. Detener Crowdfunding-Backend. 2. Abrir la pestaña "Proyectos (Crowdfunding)". | El Hub-Backend responde HTTP 502 "No se pudieron obtener los proyectos de Crowdfunding" y el panel muestra el mensaje de error sin detener las demás pestañas. | Éxito |

---

## 4. INTEGRACIÓN INCUVALAB-FRONTEND ↔ INCUVALAB-BACKEND (API REST, puerto 8000)

### Caso de Uso: Registro → Inicio de Sesión (flujo completo)

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Registrar un usuario y luego iniciar sesión con las mismas credenciales. | 1. Abrir `/register`. 2. Registrar un correo nuevo con rol Estudiante. 3. Abrir `/login`. 4. Iniciar sesión con esas credenciales. | El backend guarda el usuario con contraseña hasheada (bcrypt); el login valida la contraseña y emite un token JWT; el usuario accede según su rol. | Éxito |
| 2 | Registrar con correo ya existente. | 1. Intentar registrar un correo ya registrado. | El backend responde HTTP 400 "El correo ya se encuentra registrado" y el formulario muestra el error. | Éxito |

### Caso de Uso: Control de Acceso por Rol al Panel de Administración

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Acceso del Administrador a `/admin-dashboard`. | 1. Iniciar sesión con un usuario de rol Administrador. 2. Navegar a `/admin-dashboard`. | La ruta valida el rol y permite el acceso al panel de administración. | Éxito |
| 2 | Acceso de un rol no administrador a `/admin-dashboard`. | 1. Iniciar sesión con un usuario de rol Estudiante o Emprendedor. 2. Escribir `/admin-dashboard` directamente en la URL. | El componente `ProtectedRoute` (`adminOnly`) detecta que el rol no es Administrador y redirige a la página principal, denegando el acceso. | Éxito |

### Caso de Uso: Recuperación de Contraseña (flujo completo)

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Solicitar recuperación y restablecer la contraseña. | 1. Abrir `/forgot-password`. 2. Ingresar un correo registrado. 3. Establecer una nueva contraseña (≥8, con mayúscula, minúscula, número y especial). 4. Iniciar sesión con la nueva contraseña. | `verify-email` confirma que el correo existe (200) y `reset-password` actualiza la contraseña (200); el login con la nueva contraseña es exitoso. | Éxito |
| 2 | Restablecer con contraseña débil. | 1. Iniciar recuperación con un correo registrado. 2. Ingresar una contraseña de menos de 8 caracteres. | El backend responde HTTP 400 "La contraseña debe tener al menos 8 caracteres" y no se actualiza. | Éxito |

### Caso de Uso: Creación de Curso (Mentor) → Catálogo Público

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Mentor crea un curso → se publica en el catálogo. | 1. Iniciar sesión con rol Mentor. 2. Crear un curso con título, proveedor, tipo y categoría. 3. Guardar. 4. Cerrar sesión y abrir `/servicios/moocs` como visitante. | El backend crea el curso (201) enlazado al `mentor_id`; el catálogo público obtiene los cursos vía `GET /api/moocs/all-courses` y muestra el curso nuevo en su categoría. | Éxito |
| 2 | Mentor consulta "Mis Cursos". | 1. Iniciar sesión como Mentor. 2. Abrir `/mis-cursos`. | `GET /api/moocs/my-courses` devuelve únicamente los cursos del mentor autenticado. | Éxito |
| 3 | Rol no mentor intenta crear curso. | 1. Iniciar sesión con rol Emprendedor. 2. Intentar crear un curso desde la API. | El backend responde HTTP 403 "Solo los mentores pueden acceder a esta función". | Éxito |

### Caso de Uso: Mentoría Extremo a Extremo (Mentor → Emprendedor)

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Mentor crea tarea → aparece en "Mis Tareas" del emprendedor. | 1. Iniciar sesión como Mentor. 2. Crear una asignación para un emprendedor (título, fase, descripción). 3. Iniciar sesión como ese Emprendedor. 4. Abrir `/mis-tareas`. | El mentor recibe 201; `GET /api/mentee-assignments` devuelve la tarea al emprendedor con el nombre del mentor y la fase en texto. | Éxito |
| 2 | Emprendedor entrega la tarea → el mentor la ve entregada. | 1. Como Emprendedor, abrir la tarea en `/mis-tareas`. 2. Adjuntar archivo y entregar. 3. Iniciar sesión como Mentor y consultar las asignaciones. | `POST /api/assignments/:id/deliver` marca status 2 (entregada, 200); el mentor ve la asignación con estado entregada y los archivos de entrega. | Éxito |
| 3 | Emprendedor intenta entregar una tarea ajena. | 1. Como Emprendedor, intentar entregar una asignación de otro mentee. | El backend responde HTTP 404 "Asignación no encontrada". | Éxito |
| 4 | Emprendedor adjunta un formato no soportado. | 1. Al entregar, adjuntar un archivo `.exe`. 2. Enviar. | El backend rechaza la subida (multer: "Formato de archivo no soportado") y no se registra la entrega. | Éxito |

### Caso de Uso: Formularios de Captación ↔ Panel de Administración

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Contacto enviado desde la web → visible en el panel admin. | 1. Abrir `/contact` y enviar un mensaje. 2. Iniciar sesión como Admin. 3. Abrir la sección de contacto del panel. | El formulario llama a `POST /api/contacto` (200, `success:true`); `GET /api/contacto` devuelve el mensaje en el panel ordenado por fecha de envío. | Éxito |
| 2 | Evento creado en el panel → visible en la sección pública de eventos. | 1. Como Admin, crear un evento en el panel. 2. Abrir `/eventos` sin sesión. | `POST /api/eventos` crea el evento (201); la vista pública obtiene `GET /api/eventos` y lo muestra ordenado por fecha y hora. | Éxito |
| 3 | Solicitud de Revenue enviada → persistida. | 1. Abrir `/servicios/revenue` y enviar el formulario. 2. Consultar la tabla `revenue`. | `POST /api/revenue` responde 200 "Datos de contacto guardados exitosamente" y se registra la fila. | Éxito |
| 4 | Proyecto estudiantil (partners) enviado → persistido. | 1. Abrir `/servicios/partners` y enviar el formulario. 2. Consultar la tabla `partners`. | `POST /api/proyectos` responde 200 "Proyecto registrado exitosamente" y se registra la fila. | Éxito |

---

## 5. INTEGRACIÓN EXTREMO A EXTREMO — HUB EMPRESARIAL COMO INTEGRADOR DE MÓDULOS

**Descripción:** El Hub-Frontend actúa como punto central de navegación y redirección hacia los módulos Incuvalab y Crowdfunding.

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Navegación del Hub a Incuvalab. | 1. Abrir el Hub (8080). 2. Hacer clic en la tarjeta o enlace "Incuvalab" del menú. | Se redirige a `http://localhost:8081` y se carga la aplicación Incuvalab completa. | Éxito |
| 2 | Navegación del Hub a Crowdfunding. | 1. Abrir el Hub (8080). 2. Hacer clic en la tarjeta o enlace "Crowdfunding" del menú. | Se redirige a `http://localhost:8082` y se carga la plataforma de crowdfunding. | Éxito |
| 3 | Navegación interna del Hub a UMA y NAE. | 1. Abrir el Hub (8080). 2. Hacer clic en las tarjetas UMA y NAE. | Se navega a `/uma` y `/nae` dentro de la SPA sin salir del Hub. | Éxito |
| 4 | Panel admin: acceso directo al panel de administración de Incuvalab. | 1. Iniciar sesión como admin en el Hub. 2. En "Accesos directos", pulsar "Panel de administración" de Incuvalab. | Se abre `http://localhost:8081/admin-dashboard` e Incuvalab aplica su propia validación de rol. | Éxito |
| 5 | Panel admin: acceso directo al panel de administración de Crowdfunding. | 1. Iniciar sesión como admin en el Hub. 2. En "Accesos directos", pulsar "Panel de administración" de Crowdfunding. | Se abre `http://localhost:8082/admin/perfil` en la plataforma externa. | Éxito |
| 6 | Carga simultánea de los datos de todos los módulos en el panel. | 1. Iniciar sesión como admin en el Hub. 2. Abrir `/admin` y observar las cinco pestañas. | El panel consulta en paralelo solicitudes NAE, UMA, casos NAE, mentores (proxy Incuvalab) y proyectos (proxy Crowdfunding); si una fuente falla, muestra el error solo en esa pestaña. | Éxito |

---

## RESUMEN DE RESULTADOS

| Resultado | Cantidad de casos |
|---|---|
| Éxito | 41 |
| Fracaso | 0 |

**Nota:** Las pruebas de los apartados 2 y 3 requieren que los backends de Incuvalab (8000) y Crowdfunding (4000) estén levantados, tal como configura `docker-compose.yml` (red compartida `hub-network`). El caso 3 del apartado 2 y el caso 3 del apartado 3 verifican además la degradación controlada (HTTP 502) cuando el módulo externo no está disponible.