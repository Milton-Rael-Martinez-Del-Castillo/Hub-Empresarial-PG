# MEMORIA DE MÓDULOS — HUB EMPRESARIAL UINVALLE

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
| Incuvalab Frontend | React + JSX + Vite + Tailwind | 8081 | Propio |
| Incuvalab Backend | Node.js + Express 5 + MySQL | 8000 | Propio |
| Crowdfunding Frontend | React + JSX + Vite | 8082 | Externo (integración) |
| Crowdfunding Backend | Node.js + Express 4 + MySQL | 4000 | Externo (integración) |

Arquitectura: cliente/servidor modular, API REST, contenerización con Docker (docker-compose con
5 servicios), base de datos MySQL (bases independientes `incuvalab` y `crowdfunding`).

---

## 2. MÓDULO HUB EMPRESARIAL (PRINCIPAL) — desarrollo propio

**Función:** Página central del sistema. Actúa como integrador y navegador de los distintos
módulos (UMA, NAE, Incuvalab y Crowdfunding).

### 2.1 Funcionalidades implementadas

| Funcionalidad | Descripción |
|---|---|
| Página central de navegación | Menú superior con accesos a los módulos |
| Tarjetas de acceso a módulos | 4 tarjetas en el inicio (Incuvalab, UMA, NAE, Crowdfunding) |
| Enlace a incubación Incuvalab | Redirige a la aplicación Incuvalab (externo, puerto 8081) |
| Enlace a crowdfunding | Redirige a la plataforma externa de crowdfunding (puerto 8082) |
| Módulo UMA | Página informativa interna (detalle en sección 3) |
| Módulo NAE | Página con carrusel de casos de éxito y formulario (detalle en sección 4) |
| Sección de estadísticas | Datos ilustrativos (40+ startups, 150+ mentores, etc.), contenido decorativo |

### 2.2 Componentes del Hub

| Componente | Ruta | Contenido |
|---|---|---|
| Home | `/` | Hero, 4 tarjetas de módulos, estadísticas |
| Incuvalab | `/incuvalab` | Página informativa con enlace a la app Incuvalab (8081) |
| UMA | `/uma` | Página estática informativa (sección 3) |
| NAE | `/nae` | Carrusel + formulario (sección 4) |
| Crowdfunding | `/crowdfunding` | Página informativa con enlace a la plataforma externa (8082) |

### 2.3 Nota técnica
El Hub-Frontend es una SPA estática servida por nginx, sin backend propio ni conexión a base de
datos. La navegación a Incuvalab y Crowdfunding se realiza mediante enlaces externos fuera del SPA.

---

## 3. MÓDULO UMA (Unidad de Desarrollos Tecnológicos) — desarrollo propio

**Función:** Presentar la unidad institucional de desarrollo tecnológico.

### 3.1 Funcionalidades implementadas
- Página informativa estática con título "UMA", subtítulo "Unidad de Desarrollos Tecnológicos"
  y texto descriptivo del propósito de la unidad.
- Enlace de retorno al Hub.

### 3.2 Limitaciones de la versión actual
- No posee formularios, carrusel, ni conexión a base de datos (contenido estático).

---

## 4. MÓDULO NAE (Núcleo de Asesoramiento Empresarial) — desarrollo propio

**Función:** Visualizar casos de éxito de proyectos (carrusel) y captar interesados mediante un
formulario de solicitud de asesoría, fortaleciendo la vinculación entre la comunidad universitaria
y los emprendimientos.

### 4.1 Funcionalidades implementadas

| Funcionalidad | Descripción |
|---|---|
| Título y subtítulo institucional | "NAE — Núcleo de Asesoramiento Empresarial" |
| Carrusel de casos de éxito | Carrusel horizontal (scroll) con tarjetas de "Proyecto Destacado" |
| Formulario "Solicitar Asesoría" | Captura de Nombre y Correo electrónico |

### 4.2 Formulario — datos que registra

| Campo | Tipo | Requerido |
|---|---|---|
| Nombre | texto | Sí |
| Correo electrónico | email | Sí |

### 4.3 Estado actual (limitaciones)
- El carrusel muestra tarjetas de ejemplo (3 tarjetas estáticas sin datos reales).
- El formulario, al enviarse, muestra un mensaje de confirmación en el navegador (alert) pero
  **aún no persiste los datos en un servidor / base de datos** (quedó como componente visual).

---

## 5. MÓDULO INCUVALAB (INCUBACIÓN DE PROYECTOS) — desarrollo propio

**Función:** Gestionar el seguimiento y evolución de los emprendimientos en incubación, mediante
usuarios, cursos formativos (MOOC), mentorías por fases y administración de contenidos.

### 5.1 Autenticación y roles

**Roles soportados (cadena almacenada en BD `usuario.rol`):**

| Rol | Acceso / funcionalidad |
|---|---|
| `Administrador` | Panel de administración, gestión de contenidos y reportes |
| `Mentor` | Crear cursos, gestionar mentees y asignar tareas |
| `Emprendedor` | Recibir tareas y entregar avances |
| `Estudiante` | Rol registrable en el sistema |
| `Institución` | Rol registrable en el sistema |

**Autenticación:**
- Registro con contraseña con verificación de fortaleza (≥8 caracteres, mayúscula, minúscula,
  número, especial) y selección de rol.
- Inicio de sesión con hash (bcrypt) y emisión de token JWT (payload: id, email, rol).
- Verificación de sesión (`/verify-auth`).
- Recuperación / restablecimiento de contraseña (verificación de email).

### 5.2 Funcionalidades implementadas por área

#### a) Sistema de cursos (MOOC / aprendizaje)
| Funcionalidad | Descripción |
|---|---|
| Catálogo de cursos | Cursos con categorías, materias, escuelas y filtros |
| Búsqueda de cursos | Por título, proveedor, tipo y materia |
| Detalle de curso | Pestañas de visión general, temario, instructores |
| Crear / editar / eliminar curso | Solo para rol Mentor/Admin |
| Contenido de curso | Diapositivas con video, texto embebido, cuestionarios y recursos |
| Mi progreso | Seguimiento de avance dentro del curso |

#### b) Mentoría y asignaciones (incubación)
| Funcionalidad | Descripción |
|---|---|
| Gestión de mentees | El mentor ve sus emprendedores a cargo |
| Asignación de tareas | Mentor crea tareas con título, descripción, enlaces y archivos |
| Fases de incubación | Preincubación, Incubación, Lanzamiento |
| Entrega de avances | El emprendedor sube su entrega (archivos) |
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

#### d) Formularios de captación
| Formulario | Datos que registra |
|---|---|
| Contacto | nombres, correo, prefijo/teléfono, tipo de consulta, mensaje |
| Revenue (inversión) | nombre, nº de contacto, nombre del proyecto/institución, descripción del apoyo |
| Partners (proyectos estudiantiles) | nombre del estudiante, semestre, carrera, contacto, nombre del proyecto, descripción, tipo de proyecto, requerimiento |

### 5.3 Panel de administración

El administrador accede a un panel con secciones para gestionar:
- Mentores
- Charlas inspiradoras (Inspiring)
- Revenue / servicios
- Eventos
- Challengers
- Mensajes de contacto
- Reporte de mentees

### 5.4 Base de datos (tablas principales)
`usuario`, `mooc_catalog`, `mooc_subjects`, `mooc_course_subjects`, `mooc_schools`,
`mooc_school_subjects`, `mooc_course_slides`, `assignamet`, `file`, `curso`, `eventos`,
`mentor`, `challenger`, `inspiring`, `empresas_servicios`, `contactos`, `partners`, `revenue`.

### 5.5 API — módulo Incuvalab (principales endpoints)

| Método | Ruta | Función |
|---|---|---|
| POST | `/api/login` | Inicio de sesión (JWT) |
| POST | `/api/usuario` | Registro de usuario |
| POST | `/api/verify-email` / `/api/reset-password` | Recuperación de contraseña |
| GET | `/api/moocs/categories`, `/courses/:id`, `/subjects`, `/schools`, `/all-courses`, `/my-courses`, `/courses/:category` | Catálogo MOOC |
| POST/PUT/DELETE | `/api/moocs/courses` y `/api/moocs/courses/:id` | Gestión de cursos (Mentor/Admin) |
| GET/POST | `/api/mentees`, `/api/assignments`, `/api/mentee-assignments` | Mentoría y tareas |
| POST/PUT | `/api/assignments`, `/api/assignments/:id/deliver` | Crear/entregar tareas |
| GET/POST/PUT/DELETE | `/api/eventos`, `/api/mentor`, `/api/challenger`, `/api/inspiring`, `/api/empresas_servicios` | Gestión de contenidos |
| POST | `/api/contacto`, `/api/revenue`, `/api/proyectos` (partners) | Formularios de captación |
| GET/DELETE | `/api/contacto` | Administración de contacto |

---

## 6. MÓDULO CROWDFUNDING — SOLO INTEGRACIÓN EXTERNA

**Nota de alcance:** Este módulo **no es desarrollo propio**. Se integra una plataforma externa de
crowdfunding previamente desarrollada. El Hub únicamente enlaza y redirige a la plataforma.
Este documento incluye su descripción solo como referencia de los roles, funciones y datos que
maneja la plataforma que se integra.

### 6.1 Rol en la integración
- El Hub redirige al usuario (puerto 8082) para visualizar campañas activas y participar.
- El sistema no gestiona transacciones ni facturación (regla RN-06 del perfil).

### 6.2 Roles de la plataforma externa
| Rol | ID | Funcionalidad |
|---|---|---|
| Administrador | `1` | Gestión de proyectos, usuarios, categorías, asesorías, aprobación |
| Usuario | `2` | Crear campañas, seguir proyectos, editar perfil |

### 6.3 Funciones principales de la plataforma externa
- Registro e inicio de sesión (con autenticación de doble factor opcional – 2FA).
- Catálogo de proyectos con búsqueda y filtros por categoría.
- Creación de campañas con imágenes, documentos y video.
- Flujo de aprobación de proyectos (Pendiente → Activo/Cancelado).
- Seguimiento / me gusta de proyectos.
- Gestión de categorías y asesorías por el administrador.
- Notificaciones (aporte, comentario, meta alcanzada, cierre de proyecto).
- Cierre automático de proyectos por fecha límite (tarea programada).
- Cierre de sesión automático por inactividad.

### 6.4 Base de datos de la plataforma externa
`Rol`, `Usuario`, `Categoria`, `Proyecto`, `Asesoria`, `Proyecto_Asesoria`, `Proyecto_Imagen`,
`Proyecto_Documento`, `Usuario_Proyecto`, `Comentario`, `Notificacion`, `Usuario_Historial`,
`Proyecto_Historial`, `Proyecto_RedSocial`.

---

## 7. RELACIÓN DE LOS MÓDULOS DESARROLLADOS CON LOS OBJETIVOS Y ALCANCE DEL PERFIL

| Objetivo / Alcance del perfil | Estado en el sistema |
|---|---|
| Módulo de registro y autenticación | Implementado en Incuvalab (JWT, bcrypt, roles, recuperación) |
| Hub empresarial central | Implementado (navegación e integración de módulos UMA, NAE, Incuvalab, Crowdfunding) |

| Módulo UMA y NAE | UMA informativo; NAE con carrusel y formulario de solicitud de asesoría |
| Módulo Incuvalab (incubación) | Implementado — seguimiento por fases, mentorías, cursos |
| Módulo de integración de crowdfunding | Implementado — redirección a plataforma externa (no desarrolla la plataforma) |

---

## 8. LIMITACIONES / PENDIENTES DETECTADAS EN LA VERSIÓN ACTUAL

1. **NAE:** el formulario "Solicitar Asesoría" no persiste datos en servidor (solo muestra alert);
   el carrusel usa tarjetas de ejemplo sin datos reales.
2. **UMA:** página puramente informativa, sin formulario ni carrusel.
3. **Incuvalab — inscripción a cursos:** el botón "Inscríbete" aún no registra la inscripción
   (solo interfaz).
4. **Incuvalab — control de acceso:** la ruta `/admin-dashboard` no valida el rol en el frontend
   (cualquier usuario autenticado puede abrirla).
5. **Incuvalab — consejería de contacto:** la gestión de contacto y formularios dependen de la
   configuración del entorno.
6. **Crowdfunding:** al tratarse de integración externa, cualquier mejora funcional depende de la
   plataforma integrada, no de este proyecto.

---

## 9. RESUMEN EJECUTIVO

- **Desarrollo propio:** Hub Empresarial (navegación/integración), Módulo UMA (informativo),
  Módulo NAE (carrusel + formulario), Módulo Incuvalab (autenticación, roles, cursos MOOC,
  mentoría por fases, gestión de contenidos y panel de administración).
- **Integración externa:** Crowdfunding (el Hub redirige a la plataforma externa; no gestiona
  transacciones).
- **Tecnología:** React, Node.js/Express, MySQL, Docker; seguridad con JWT y hash de contraseñas.
