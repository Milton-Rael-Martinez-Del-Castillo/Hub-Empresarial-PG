# MEMORIA DE MÓDULOS — HUB EMPRESARIAL UNIVALLE

Documento técnico que describe qué hace realmente cada módulo desarrollado en el proyecto,
basado en el código fuente implementado. Sirve de base para la descripción del sistema en la
documentación (memoria de ingeniería).

**Alcance de desarrollo propio:** Hub Empresarial, Módulo UMA, Módulo NAE, Módulo Incuvalab.
**Solo integración externa:** Módulo Crowdfunding (plataforma externa previamente desarrollada,
el proyecto únicamente la enlaza y redirige, no la documenta como desarrollo propio).

---

## 1. VISIÓN GENERAL DEL SISTEMA

| Componente | Tecnología | Puerto | Desarrollo |
|---|---|---|---|
| Hub Empresarial (Frontend) | React + TypeScript + Vite + Tailwind | 8080 | Propio |
| Hub Empresarial (Backend) | Node.js + Express 5 + MySQL | 8083 | Propio |
| Incuvalab Frontend | React + JSX + Vite + Tailwind | 8081 | Propio |
| Incuvalab Backend | Node.js + Express 5 + MySQL | 8000 | Propio |
| Crowdfunding Frontend | React + JSX + Vite | 8082 | Externo (integración) |
| Crowdfunding Backend | Node.js + Express 4 + MySQL | 4001 (contenedor 4000) | Externo (integración) |

Arquitectura: cliente/servidor modular, API REST, contenerización con Docker (docker-compose con
7 servicios: `hub-frontend`, `hub-backend`, `hub-db`, `incuvalab-frontend`, `incuvalab-backend`,
`crowdfunding-frontend` y `crowdfunding-backend`) sobre la red `hub-network`, con tres bases MySQL
independientes (Hub, Incuvalab y Crowdfunding).

---

## 2. MÓDULO HUB EMPRESARIAL (PRINCIPAL) — desarrollo propio

**Función:** Página central del sistema. Actúa como integrador y navegador de los distintos
módulos (UMA, NAE, Incuvalab y Crowdfunding), y como panel de administración de las solicitudes
captadas por el Hub.

### 2.1 Funcionalidades implementadas

| Funcionalidad | Descripción |
|---|---|
| Página central de navegación | Menú superior con accesos a los módulos |
| Tarjetas de acceso a módulos | 4 tarjetas en el inicio (Incuvalab, UMA, NAE, Crowdfunding) |
| Enlace a incubación Incuvalab | Redirige a la aplicación Incuvalab (puerto 8081) |
| Enlace a crowdfunding | Redirige a la plataforma externa de crowdfunding (puerto 8082) |
| Módulo UMA | Página informativa con formulario de solicitud (detalle en sección 3) |
| Módulo NAE | Página con carrusel dinámico y formulario de asesoría (detalle en sección 4) |
| Autenticación de administrador | `POST /api/hub/login` con bcrypt y JWT; token en `hub_token` |
| Panel de administración | `/admin` con pestañas Solicitudes NAE, Solicitudes UMA, Casos de Éxito NAE, Mentores (Incuvalab) y Proyectos (Crowdfunding) |
| Persistencia de solicitudes | NAE y UMA se guardan en la base MySQL del Hub |
| Gestión del carrusel NAE | Alta, edición y eliminación de casos de éxito desde el panel |
| Vistas de integración | Consulta de solo lectura a mentores de Incuvalab y proyectos de Crowdfunding |
| Sección de estadísticas | Datos ilustrativos (40+ startups, 150+ mentores, etc.), contenido decorativo |

### 2.2 Componentes del Hub

| Componente | Ruta | Contenido |
|---|---|---|
| Home | `/` | Hero, 4 tarjetas de módulos, estadísticas |
| Incuvalab | `/incuvalab` | Página informativa con enlace a la app Incuvalab (8081) |
| UMA | `/uma` | Página informativa y formulario de solicitud (sección 3) |
| NAE | `/nae` | Carrusel dinámico y formulario (sección 4) |
| Crowdfunding | `/crowdfunding` | Página informativa con enlace a la plataforma externa (8082) |
| Login de administrador | `/admin/login` | Formulario de acceso al panel del Hub |
| Panel de administración | `/admin` | Panel protegido por `ProtectedAdmin` (token JWT) |

### 2.3 Nota técnica
El Hub-Frontend es una SPA servida por nginx que consume su propio backend Express 5 en el puerto
8083, con base de datos MySQL independiente. Las páginas UMA y NAE siguen dentro de la SPA, pero
sus formularios ya persisten en el backend; el carrusel NAE se alimenta de la tabla
`nae_casos_exito`. La navegación a Incuvalab y Crowdfunding se realiza mediante enlaces externos.
El backend crea las tablas al iniciar y siembra un administrador por defecto a partir de las
variables `ADMIN_DEFAULT_NAME`, `ADMIN_DEFAULT_EMAIL` y `ADMIN_DEFAULT_PASSWORD`; no existe registro
público de administradores. Los endpoints del panel (`/api/nae/solicitudes`, `/api/uma/solicitudes`,
CRUD de casos y proxies externos) validan el JWT con el middleware `auth`.

---

## 3. MÓDULO UMA (Unidad de Desarrollos Tecnológicos) — desarrollo propio

**Función:** Presentar la unidad institucional de desarrollo tecnológico y captar solicitudes de
desarrollo mediante un formulario.

### 3.1 Funcionalidades implementadas
- Página informativa con título "UMA", subtítulo "Unidad de Desarrollos Tecnológicos" y texto
  descriptivo del propósito de la unidad.
- Formulario "Solicitar desarrollo" con nombre, correo y mensaje.
- Persistencia de la solicitud mediante `POST /api/uma/solicitudes` (HTTP 201) en la tabla
  `uma_solicitudes` y mensaje de confirmación en pantalla.
- Enlace de retorno al Hub.

### 3.2 Formulario — datos que registra

| Campo | Tipo | Requerido |
|---|---|---|
| Nombre | texto | Sí |
| Correo electrónico | email | Sí |
| Mensaje | texto | No |

### 3.3 Estado actual (limitaciones)
- Las solicitudes se listan y eliminan desde el panel del Hub; no existe flujo de respuesta,
  asignación ni cambio de estado.
- El resto del contenido de la página es estático.

---

## 4. MÓDULO NAE (Núcleo de Asesoramiento Empresarial) — desarrollo propio

**Función:** Visualizar casos de éxito de proyectos (carrusel administrable) y captar interesados
mediante un formulario de solicitud de asesoría, fortaleciendo la vinculación entre la comunidad
universitaria y los emprendimientos.

### 4.1 Funcionalidades implementadas

| Funcionalidad | Descripción |
|---|---|
| Título y subtítulo institucional | "NAE — Núcleo de Asesoramiento Empresarial" |
| Carrusel de casos de éxito | Tarjetas "Proyecto Destacado" obtenidas de `GET /api/nae/casos` |
| Formulario "Solicitar Asesoría" | Captura de Nombre y Correo electrónico |
| Persistencia de la solicitud | `POST /api/nae/solicitudes` (HTTP 201) en `nae_solicitudes` |

### 4.2 Formulario — datos que registra

| Campo | Tipo | Requerido |
|---|---|---|
| Nombre | texto | Sí |
| Correo electrónico | email | Sí |

### 4.3 Estado actual
- El carrusel se alimenta de la base de datos; si la tabla está vacía, el backend siembra tres
  casos de ejemplo ("Proyecto Destacado 1/2/3").
- El administrador puede crear, editar y eliminar los casos desde el panel del Hub, y los cambios
  se reflejan en la página pública.
- Las solicitudes se persisten y pueden consultarse y eliminarse desde el panel; no hay envío de
  correos ni seguimiento de estado.

---

## 5. MÓDULO INCUVALAB (INCUBACIÓN DE PROYECTOS) — desarrollo propio

**Función:** Gestionar el seguimiento y evolución de los emprendimientos en incubación, mediante
usuarios, cursos formativos (MOOC), mentorías por fases y administración de contenidos.

### 5.1 Autenticación y roles

**Roles soportados (cadena almacenada en BD `usuario.rol`):**

| Rol | Acceso / funcionalidad | Registro público |
|---|---|---|
| `Administrador` | Panel de administración, gestión de contenidos y reportes | No |
| `Mentor` | Crear cursos, gestionar mentees y asignar tareas | No |
| `Emprendedor` | Recibir tareas y entregar avances | Sí |
| `Estudiante` | Rol registrable en el sistema | Sí |
| `Institución` | Rol registrable en el sistema | Sí |

**Autenticación:**
- Registro público limitado a los roles Emprendedor, Estudiante e Institución; el backend rechaza
  Administrador y Mentor (roles privilegiados) con HTTP 400.
- Contraseña con verificación de fortaleza (≥8 caracteres, mayúscula, minúscula, número, especial).
- Inicio de sesión con hash (bcrypt) y emisión de token JWT (payload: id, email, rol).
- Verificación de sesión (`/verify-auth`).
- Recuperación de contraseña en dos pasos (`verify-email` + `reset-password`); no se envía un
  correo real, la verificación es directa contra la base de datos.

### 5.2 Funcionalidades implementadas por área

#### a) Sistema de cursos (MOOC / aprendizaje)
| Funcionalidad | Descripción |
|---|---|
| Catálogo de cursos | Cursos con categorías, materias, escuelas y filtros |
| Búsqueda de cursos | Por título, proveedor, tipo y materia |
| Detalle de curso | Pestañas de visión general, temario, instructores y recursos |
| Crear curso | Solo rol Mentor (`authMentor`); queda enlazado a su `mentor_id` |
| Editar / eliminar curso | Requiere JWT, pero el backend no vuelve a verificar el rol Mentor |
| Contenido de curso | Diapositivas con video, texto embebido, cuestionarios y recursos |
| Mi progreso | Indicador calculado en el cliente según la diapositiva actual; no se persiste |
| Cuestionarios | Calificación en el cliente; no se registran los resultados |

#### b) Mentoría y asignaciones (incubación)
| Funcionalidad | Descripción |
|---|---|
| Gestión de mentees | El mentor ve sus emprendedores a cargo |
| Asignación de tareas | Mentor crea tareas con título, descripción, enlaces y archivos |
| Fases de incubación | Preincubación, Incubación, Lanzamiento |
| Entrega de avances | El emprendedor sube su entrega (archivos validados con multer) |
| Reporte de mentees | El administrador consulta avance por fase |

#### c) Contenidos institucionales (CRUD administrable)
| Área | Funcionalidad |
|---|---|
| Mentores | Registro y gestión de mentores |
| Eventos | Gestión de eventos (título, descripción, fecha, hora, lugar) |
| Challengers | Gestión de retos |
| Inspiring talks | Gestión de charlas inspiradoras |
| Empresas/servicios | Gestión de servicios ofrecidos |
| Contacto | Recepción y administración de mensajes de contacto |

**Nota:** estas rutas no aplican middleware de autenticación en el backend; la restricción de
acceso se implementa en el frontend mediante `ProtectedRoute` y el panel de administración.

#### d) Formularios de captación
| Formulario | Datos que registra |
|---|---|
| Contacto | nombres, correo, prefijo/teléfono, tipo de consulta, mensaje |
| Revenue (inversión) | nombre, nº de contacto, nombre del proyecto/institución, descripción del apoyo |
| Partners (proyectos estudiantiles) | nombre del estudiante, semestre, carrera, contacto, nombre del proyecto, descripción, tipo de proyecto, requerimiento |

Revenue y Partners solo exponen `POST` (persistencia); sus registros no se listan en el panel de
administración. Contacto sí dispone de listado y eliminación.

### 5.3 Panel de administración

El administrador accede a un panel con secciones para gestionar:
- Mentores
- Charlas inspiradoras (Inspiring)
- Revenue / servicios (en realidad administra la tabla `empresas_servicios`)
- Eventos
- Challengers
- Mensajes de contacto
- Reporte de mentees

### 5.4 Base de datos (tablas principales)

**Hub Empresarial:** `admin_usuario`, `nae_solicitudes`, `uma_solicitudes`, `nae_casos_exito`.

**Incuvalab:** `usuario`, `mooc_catalog`, `mooc_subjects`, `mooc_course_subjects`, `mooc_schools`,
`mooc_school_subjects`, `mooc_course_slides`, `assignamet`, `file`, `curso`, `eventos`,
`mentor`, `challenger`, `inspiring`, `empresas_servicios`, `contactos`, `partners`, `revenue`.

### 5.5 API — principales endpoints

**Hub Empresarial (puerto 8083):**

| Método | Ruta | Función |
|---|---|---|
| POST | `/api/hub/login` | Inicio de sesión del administrador (JWT) |
| GET | `/api/hub/verify-auth` | Verificación de sesión |
| POST | `/api/nae/solicitudes` | Registrar solicitud NAE (público) |
| GET / DELETE | `/api/nae/solicitudes` | Listar / eliminar solicitudes (JWT) |
| GET | `/api/nae/casos` | Listar casos de éxito (público) |
| POST / PUT / DELETE | `/api/nae/casos` y `/api/nae/casos/:id` | Gestionar casos de éxito (JWT) |
| POST | `/api/uma/solicitudes` | Registrar solicitud UMA (público) |
| GET / DELETE | `/api/uma/solicitudes` | Listar / eliminar solicitudes (JWT) |
| GET | `/api/hub/mentores` | Proxy de solo lectura a Incuvalab (JWT) |
| GET | `/api/hub/proyectos-crowdfunding` | Proxy de solo lectura a Crowdfunding (JWT) |

**Incuvalab (puerto 8000):**

| Método | Ruta | Función |
|---|---|---|
| POST | `/api/login` | Inicio de sesión (JWT) |
| POST | `/api/usuario` | Registro de usuario (roles no privilegiados) |
| POST | `/api/verify-email` / `/api/reset-password` | Recuperación de contraseña |
| GET | `/api/moocs/categories`, `/courses/:id`, `/subjects`, `/schools`, `/all-courses`, `/my-courses`, `/courses/:category` | Catálogo MOOC |
| POST | `/api/moocs/courses` | Crear curso (Mentor) |
| PUT / DELETE | `/api/moocs/courses/:id` | Editar / eliminar curso (JWT) |
| GET/POST/PUT/DELETE | `/api/mentees`, `/api/assignments`, `/api/mentee-assignments` | Mentoría y tareas |
| POST | `/api/assignments/:id/deliver` | Entregar tarea con archivos |
| GET/POST/PUT/DELETE | `/api/eventos`, `/api/mentor`, `/api/challenger`, `/api/inspiring`, `/api/empresas_servicios` | Gestión de contenidos |
| POST | `/api/contacto`, `/api/revenue`, `/api/proyectos` (partners) | Formularios de captación |
| GET/DELETE | `/api/contacto` | Administración de contacto |

---

## 6. MÓDULO CROWDFUNDING — SOLO INTEGRACIÓN EXTERNA

**Nota de alcance:** Este módulo **no es desarrollo propio**. Se integra una plataforma externa de
crowdfunding previamente desarrollada.

- El Hub redirige al usuario (puerto 8082) para visualizar campañas activas y participar.
- El panel del Hub consume `GET /api/hub/proyectos-crowdfunding`, un proxy de solo lectura hacia
  `GET /api/proyectos/todos` del backend externo (puerto 4001 en el host), para mostrar el listado
  de proyectos y su estado de aprobación.
- El sistema no gestiona transacciones ni facturación (regla RN-06 del perfil).

---

## 7. RELACIÓN DE LOS MÓDULOS DESARROLLADOS CON LOS OBJETIVOS Y ALCANCE DEL PERFIL

| Objetivo / Alcance del perfil | Estado en el sistema |
|---|---|
| Módulo de registro y autenticación | Implementado en Incuvalab (JWT, bcrypt, roles, recuperación) |
| Hub empresarial central | Implementado (navegación, backend propio, base de datos y panel de administración) |
| Módulo UMA | Implementado (información institucional y solicitudes persistentes) |
| Módulo NAE | Implementado (carrusel administrable y solicitudes persistentes) |
| Módulo Incuvalab (incubación) | Implementado — seguimiento por fases, mentorías, cursos |
| Módulo de integración de crowdfunding | Implementado — redirección y consulta de solo lectura (no desarrolla la plataforma) |
| Panel de administración del Hub | Implementado — solicitudes NAE/UMA, casos NAE y vistas de integración |

---

## 8. LIMITACIONES / PENDIENTES DETECTADAS EN LA VERSIÓN ACTUAL

1. **Incuvalab — inscripción a cursos:** el botón "Inscríbete" aún no registra la inscripción
   (solo interfaz); el progreso y los cuestionarios se calculan en el cliente y no se persisten.
2. **Incuvalab — autorización en backend:** las rutas de contenidos (mentores, eventos,
   challengers, inspiring, empresas/servicios, contacto) no tienen middleware de autenticación; la
   edición/eliminación de cursos solo valida el JWT, no el rol Mentor. La protección del panel es
   efectiva en el frontend (`ProtectedRoute`), no en la API.
3. **Incuvalab — panel administrativo:** la sección "Revenue / servicios" administra
   `empresas_servicios`, no las solicitudes de Revenue; estas y las de Partners solo se persisten,
   sin listado administrativo.
4. **Seguridad:** ambos backends usan un secreto JWT de respaldo hardcodeado si falta
   `JWT_SECRET`; debe configurarse siempre por entorno. La recuperación de contraseña no envía
   correo real.
5. **Hub:** el panel está protegido en el frontend y sus endpoints validan JWT, pero no existe
   gestión de múltiples administradores ni roles; el administrador se siembra al iniciar.
6. **Crowdfunding:** al tratarse de integración externa, cualquier mejora funcional depende de la
   plataforma integrada, no de este proyecto.

---

## 9. RESUMEN EJECUTIVO

- **Desarrollo propio:** Hub Empresarial (navegación, backend Express/MySQL y panel de
  administración), Módulo UMA (informativo + solicitudes), Módulo NAE (carrusel administrable +
  solicitudes), Módulo Incuvalab (autenticación, roles, cursos MOOC, mentoría por fases, gestión
  de contenidos y panel de administración).
- **Integración externa:** Crowdfunding (el Hub redirige a la plataforma externa y muestra sus
  proyectos en modo lectura; no gestiona transacciones).
- **Tecnología:** React, Node.js/Express, MySQL, Docker; seguridad con JWT y hash de contraseñas.
