# APÉNDICE Nº 3

# PRUEBAS UNITARIAS (CAJA NEGRA)

En las siguientes tablas, cada fila representa un caso de prueba unitario específico para cada caso de uso en el proyecto. La tabla incluye columnas para el número de caso de prueba unitaria, el escenario que se está probando, los pasos para realizar la prueba, el resultado esperado y el resultado real en forma de éxito/fracaso (si hubiera fracaso, entonces se detallará lo que sucedió).

**Alcance (desarrollo propio):** Módulo Hub Empresarial, Módulo UMA, Módulo NAE y Módulo Incuvalab. El módulo Crowdfunding es integración externa y se documenta en las pruebas de integración (Apéndice Nº 4).

**Verificación automatizada (2026-09-24):** Los casos descritos están respaldados por suites automatizadas ejecutables con `npm test` en cada proyecto (con la base de datos simulada, sin depender de MySQL):

| Proyecto | Herramienta | Archivos de prueba | Resultado |
|---|---|---|---|
| Hub-Backend | Jest + Supertest | `tests/hubLogin.test.js`, `tests/nae.test.js`, `tests/uma.test.js` | 27/27 ✔ |
| Incuvalab-Backend | Jest + Supertest | `tests/auth.test.js`, `tests/usuario.test.js`, `tests/authMentor.test.js` | 24/24 ✔ |
| Hub-Frontend | Vitest + React Testing Library | `src/components/ProtectedAdmin.test.tsx`, `src/api/hubApi.test.ts` | 6/6 ✔ |
| Incuvalab-Frontend | Vitest + React Testing Library | `src/components/ProtectedRoute.test.jsx`, `src/components/login/Register.test.jsx` | 12/12 ✔ |
| **Total** | | | **69/69 ✔** |

---

## MÓDULO HUB EMPRESARIAL

### Caso de Uso: Iniciar Sesión en el Sistema Web (Administrador)

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Inicio de sesión exitoso con credenciales válidas. | 1. Abrir la página de inicio de sesión del Hub. 2. Ingresar un correo registrado como administrador y su contraseña. 3. Hacer clic en el botón "Iniciar Sesión". | El inicio de sesión es exitoso. Se concede acceso al panel de administración y se genera un token JWT. | Éxito |
| 2 | Inicio de sesión fallido con contraseña incorrecta. | 1. Abrir la página de inicio de sesión. 2. Ingresar un correo válido y una contraseña incorrecta. 3. Hacer clic en el botón "Iniciar Sesión". | El inicio de sesión falla con el mensaje "Credenciales incorrectas" (HTTP 401). Se le niega el acceso al usuario. | Éxito |
| 3 | Inicio de sesión fallido con correo inexistente. | 1. Abrir la página de inicio de sesión. 2. Ingresar un correo no registrado y una contraseña válida. 3. Hacer clic en el botón "Iniciar Sesión". | El inicio de sesión falla con el mensaje "Credenciales incorrectas" (HTTP 401). Se le niega el acceso al usuario. | Éxito |
| 4 | Inicio de sesión fallido con campos obligatorios vacíos. | 1. Abrir la página de inicio de sesión. 2. Dejar vacíos los campos de correo y contraseña. 3. Hacer clic en el botón "Iniciar Sesión". | El inicio de sesión falla con el mensaje "Correo y contraseña son obligatorios" (HTTP 400). Se le niega el acceso al usuario. | Éxito |

### Caso de Uso: Cerrar Sesión en el Sistema Web

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Cierre de sesión exitoso después de una sesión de administrador. | 1. Iniciar sesión con credenciales válidas. 2. Hacer clic en el botón "Cerrar Sesión". | El usuario cerró sesión exitosamente y el token se elimina del almacenamiento local. | Éxito |
| 2 | Redirigir después de cerrar sesión correctamente. | 1. Iniciar sesión con credenciales válidas. 2. Hacer clic en el botón "Cerrar Sesión". 3. Observar la página o URL a la que se redirige al usuario. | El usuario es redirigido a la página de inicio de sesión. | Éxito |

### Caso de Uso: Verificar Sesión Activa

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Verificar sesión con token válido. | 1. Iniciar sesión con credenciales válidas. 2. Recargar la página o navegar a una ruta protegida. | La API responde `isAuthenticated: true` con los datos del usuario; se mantiene el acceso al panel. | Éxito |
| 2 | Verificar sesión sin token. | 1. Abrir la aplicación sin haber iniciado sesión. 2. Navegar a una ruta protegida. | La API responde `isAuthenticated: false` y se redirige al inicio de sesión. | Éxito |
| 3 | Verificar sesión con token inválido o expirado. | 1. Almacenar un token corrupto en el navegador. 2. Recargar la página. | La API responde `isAuthenticated: false` y se redirige al inicio de sesión. | Éxito |
| 4 | Acceso a recurso protegido sin token. | 1. Realizar una petición a `/api/hub/mentores` sin encabezado de autorización. | La API responde HTTP 401 "Acceso no autorizado. Token no proporcionado." | Éxito |

### Caso de Uso: Navegar entre Módulos del Hub

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Acceso a la tarjeta Incuvalab. | 1. Abrir la página principal del Hub. 2. Hacer clic en la tarjeta "Incuvalab". | Se redirige a la aplicación Incuvalab (puerto 8081). | Éxito |
| 2 | Acceso a la tarjeta UMA. | 1. Abrir la página principal del Hub. 2. Hacer clic en la tarjeta "UMA". | Se abre la página informativa del módulo UMA. | Éxito |
| 3 | Acceso a la tarjeta NAE. | 1. Abrir la página principal del Hub. 2. Hacer clic en la tarjeta "NAE". | Se abre la página del módulo NAE con el carrusel y el formulario. | Éxito |
| 4 | Acceso a la tarjeta Crowdfunding. | 1. Abrir la página principal del Hub. 2. Hacer clic en la tarjeta "Crowdfunding". | Se redirige a la plataforma externa de crowdfunding (puerto 8082). | Éxito |

---

## MÓDULO UMA (Unidad de Desarrollos Tecnológicos)

### Caso de Uso: Visualizar Página Informativa del Módulo UMA

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Visualizar contenido estático de la página UMA. | 1. Navegar a la ruta `/uma` desde el Hub. 2. Observar el contenido mostrado. | Se muestra el título "UMA", el subtítulo "Unidad de Desarrollos Tecnológicos" y el texto descriptivo de la unidad. | Éxito |
| 2 | Retorno al Hub desde el módulo UMA. | 1. Navegar a la ruta `/uma`. 2. Hacer clic en el enlace de retorno al Hub. | Se redirige a la página principal del Hub Empresarial. | Éxito |

### Caso de Uso: Enviar Solicitud de Contacto al Módulo UMA

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Envío exitoso de solicitud con datos válidos. | 1. Abrir el formulario de solicitud UMA. 2. Ingresar nombre y correo válidos. 3. Enviar el formulario. | La API responde HTTP 201 con `success: true` y el mensaje "Solicitud enviada correctamente". | Éxito |
| 2 | Envío fallido con nombre vacío. | 1. Abrir el formulario de solicitud UMA. 2. Dejar el campo nombre vacío e ingresar un correo válido. 3. Enviar el formulario. | La API responde HTTP 400 "El nombre y el correo son obligatorios". | Éxito |
| 3 | Envío fallido con correo vacío. | 1. Abrir el formulario de solicitud UMA. 2. Ingresar un nombre válido y dejar el correo vacío. 3. Enviar el formulario. | La API responde HTTP 400 "El nombre y el correo son obligatorios". | Éxito |
| 4 | Envío con mensaje opcional. | 1. Abrir el formulario de solicitud UMA. 2. Ingresar nombre, correo y un mensaje adicional. 3. Enviar el formulario. | La solicitud se registra correctamente incluyendo el mensaje (HTTP 201). | Éxito |

---

## MÓDULO NAE (Núcleo de Asesoramiento Empresarial)

### Caso de Uso: Visualizar Casos de Éxito (Carrusel NAE)

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Visualización exitosa del carrusel de casos de éxito. | 1. Navegar a la ruta `/nae`. 2. Observar las tarjetas de "Proyecto Destacado". | Se muestran los casos de éxito obtenidos de `GET /api/nae/casos` con título, descripción e imagen. | Éxito |
| 2 | Carrusel sin casos registrados. | 1. Consultar `GET /api/nae/casos` con la tabla vacía. 2. Observar el carrusel. | La API responde HTTP 200 con lista vacía y el carrusel no muestra tarjetas (se conservan los 3 casos por defecto tras el seed). | Éxito |
| 3 | Desplazamiento horizontal del carrusel. | 1. Navegar a la ruta `/nae`. 2. Realizar scroll horizontal o usar los controles del carrusel. | El carrusel se desplaza mostrando las tarjetas restantes. | Éxito |

### Caso de Uso: Enviar Solicitud de Asesoría NAE

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Envío exitoso con nombre y correo válidos. | 1. Abrir el formulario "Solicitar Asesoría". 2. Ingresar nombre y correo válidos. 3. Enviar el formulario. | La API responde HTTP 201 con `success: true` y el mensaje "Solicitud enviada correctamente". | Éxito |
| 2 | Envío fallido con nombre vacío. | 1. Abrir el formulario "Solicitar Asesoría". 2. Dejar el nombre vacío e ingresar un correo válido. 3. Enviar el formulario. | La API responde HTTP 400 "El nombre y el correo son obligatorios". | Éxito |
| 3 | Envío fallido con correo vacío o no válido. | 1. Abrir el formulario "Solicitar Asesoría". 2. Ingresar un nombre válido y un correo vacío o mal formado. 3. Enviar el formulario. | La API rechaza la solicitud: HTTP 400 "El nombre y el correo son obligatorios". | Éxito |
| 4 | Campos vacíos en el formulario. | 1. Abrir el formulario "Solicitar Asesoría". 2. Dejar ambos campos vacíos. 3. Enviar el formulario. | La API rechaza la solicitud: HTTP 400 "El nombre y el correo son obligatorios". | Éxito |

### Caso de Uso: Gestionar Casos de Éxito NAE (Panel de Administración)

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Consultar casos de éxito con sesión válida. | 1. Iniciar sesión como administrador. 2. Navegar al panel de administración del Hub. 3. Acceder a la sección de casos NAE. | La API responde HTTP 200 con la lista de casos ordenados por `orden`. | Éxito |
| 2 | Crear un caso de éxito con datos válidos. | 1. Iniciar sesión como administrador. 2. En el panel, completar título y descripción de un nuevo caso. 3. Guardar. | La API responde HTTP 201 con `success: true` y el id del caso creado. | Éxito |
| 3 | Crear un caso de éxito sin título o descripción. | 1. Iniciar sesión como administrador. 2. En el panel, dejar vacío el título (o la descripción). 3. Guardar. | La API responde HTTP 400 "El título y la descripción son obligatorios". | Éxito |
| 4 | Editar un caso de éxito existente. | 1. Iniciar sesión como administrador. 2. Modificar el título/descripción de un caso existente. 3. Guardar. | La API responde HTTP 200 con "Caso actualizado correctamente". | Éxito |
| 5 | Editar un caso de éxito inexistente. | 1. Enviar `PUT /api/nae/casos/:id` con un id no registrado. | La API responde HTTP 404 "Caso no encontrado". | Éxito |
| 6 | Eliminar un caso de éxito existente. | 1. Iniciar sesión como administrador. 2. Eliminar un caso de éxito. | La API responde HTTP 200 con "Caso eliminado correctamente". | Éxito |
| 7 | Eliminar un caso de éxito inexistente. | 1. Enviar `DELETE /api/nae/casos/:id` con un id no registrado. | La API responde HTTP 404 "Caso no encontrado". | Éxito |

### Caso de Uso: Administrar Solicitudes de Asesoría NAE

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Consultar solicitudes de asesoría con sesión válida. | 1. Iniciar sesión como administrador. 2. Acceder a la sección de solicitudes NAE. | La API responde HTTP 200 con la lista de solicitudes ordenadas por fecha de creación descendente. | Éxito |
| 2 | Eliminar una solicitud existente. | 1. Iniciar sesión como administrador. 2. Eliminar una solicitud de asesoría. | La API responde HTTP 200 con "Solicitud eliminada correctamente". | Éxito |
| 3 | Eliminar una solicitud inexistente. | 1. Enviar `DELETE /api/nae/solicitudes/:id` con un id no registrado. | La API responde HTTP 404 "Solicitud no encontrada". | Éxito |

---

## MÓDULO INCUVALAB — AUTENTICACIÓN Y USUARIOS

### Caso de Uso: Registro de Usuario

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Registro exitoso con correo nuevo y rol Emprendedor. | 1. Abrir la página de registro. 2. Ingresar un correo no registrado y una contraseña. 3. Seleccionar el rol Emprendedor. 4. Enviar el formulario. | La API responde HTTP 200 con "Usuario registrado exitosamente". | Éxito |
| 2 | Registro fallido con correo ya registrado. | 1. Abrir la página de registro. 2. Ingresar un correo que ya está registrado. 3. Enviar el formulario. | La API responde HTTP 400 "El correo ya se encuentra registrado". | Éxito |
| 3 | Registro con campos vacíos. | 1. Abrir la página de registro. 2. Dejar vacíos los campos de correo y contraseña. 3. Enviar el formulario. | El registro se rechaza: HTTP 400 "Todos los campos son obligatorios". | Éxito |
| 4 | Registro con contraseña débil. | 1. Abrir la página de registro. 2. Ingresar un correo válido y una contraseña de menos de 8 caracteres sin mayúsculas/números. 3. Enviar el formulario. | El registro se rechaza: HTTP 400 indicando los requisitos de fortaleza de contraseña (mínimo 8 caracteres, mayúscula, minúscula, número, carácter especial). | Éxito |
| 5 | Registro con rol de Administrador desde un cliente. | 1. Enviar `POST /api/usuario` con rol `Administrador`. | El registro se rechaza: HTTP 400 "El rol seleccionado no es válido". Solo se permiten los roles Emprendedor, Estudiante e Institución. | Éxito |

### Caso de Uso: Iniciar Sesión en Incuvalab

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Inicio de sesión exitoso con credenciales válidas. | 1. Abrir la página de inicio de sesión. 2. Ingresar correo y contraseña registrados. 3. Hacer clic en "Iniciar Sesión". | El inicio de sesión es exitoso; se genera un token JWT y se accede según el rol del usuario. | Éxito |
| 2 | Inicio de sesión fallido con contraseña incorrecta. | 1. Abrir la página de inicio de sesión. 2. Ingresar un correo válido y una contraseña incorrecta. 3. Hacer clic en "Iniciar Sesión". | El inicio de sesión falla: HTTP 401 "Credenciales incorrectas". | Éxito |
| 3 | Inicio de sesión fallido con usuario inexistente. | 1. Abrir la página de inicio de sesión. 2. Ingresar un correo no registrado. 3. Hacer clic en "Iniciar Sesión". | El inicio de sesión falla: HTTP 401 "Credenciales incorrectas". | Éxito |
| 4 | Los campos vacíos no deberían permitir el inicio de sesión. | 1. Abrir la página de inicio de sesión. 2. Dejar vacíos correo y contraseña. 3. Hacer clic en "Iniciar Sesión". | El inicio de sesión falla y no se otorga acceso. | Éxito |

### Caso de Uso: Verificar Sesión en Incuvalab

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Verificar sesión con token válido. | 1. Iniciar sesión. 2. Navegar a una ruta protegida. | La API responde `isAuthenticated: true`. | Éxito |
| 2 | Verificar sesión sin token o con token inválido. | 1. Remover el token o almacenar uno corrupto. 2. Navegar a una ruta protegida. | La API responde `isAuthenticated: false` y se redirige al inicio de sesión. | Éxito |
| 3 | Acceso a ruta de administrador sin el rol correspondiente. | 1. Iniciar sesión con un rol no administrador. 2. Intentar abrir `/admin-dashboard` directamente. | El acceso se deniega y se redirige a la página principal; solo el rol Administrador puede abrir el panel. | Éxito |

### Caso de Uso: Recuperar una Cuenta

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Recuperación exitosa de la cuenta. | 1. Iniciar el proceso de recuperación. 2. Ingresar un correo registrado. 3. Hacer clic en el botón "Recuperar Cuenta". 4. Establecer una nueva contraseña (≥8 caracteres). 5. Iniciar sesión con la nueva contraseña. | `POST /api/verify-email` responde HTTP 200 y `POST /api/reset-password` actualiza la contraseña; el usuario puede iniciar sesión con la nueva contraseña. | Éxito |
| 2 | Correo electrónico no registrado. | 1. Iniciar el proceso de recuperación. 2. Ingresar un correo no registrado. 3. Hacer clic en el botón "Recuperar Cuenta". | La API responde HTTP 404 "No se encontró una cuenta con este correo electrónico". | Éxito |
| 3 | Cambio de contraseña con nueva contraseña débil. | 1. Iniciar el proceso de recuperación con un correo registrado. 2. Ingresar una nueva contraseña de menos de 8 caracteres. 3. Confirmar. | La API responde HTTP 400 "La contraseña debe tener al menos 8 caracteres" y no se actualiza. | Éxito |

---

## MÓDULO INCUVALAB — CURSOS MOOC

### Caso de Uso: Consultar Catálogo de Cursos

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Visualizar catálogo de cursos. | 1. Acceder a la página de cursos. 2. Observar los cursos listados. | La API responde HTTP 200 con los cursos agrupados por categoría (`GET /api/moocs/all-courses`). | Éxito |
| 2 | Filtrar cursos por categoría. | 1. Seleccionar una categoría en la página de cursos. | `GET /api/moocs/courses/:category` devuelve solo los cursos de esa categoría (HTTP 200). | Éxito |
| 3 | Consultar categorías especiales popular, nuevo y tendencia. | 1. Navegar a las secciones "Populares", "Nuevos" o "Tendencias". | La API devuelve los cursos marcados con `is_popular`, `is_new` o `is_trending` según corresponda. | Éxito |
| 4 | Consultar materias y escuelas. | 1. Acceder a los filtros por materia/escuela. | La API responde HTTP 200 con `GET /api/moocs/subjects` y `GET /api/moocs/schools`. | Éxito |

### Caso de Uso: Visualizar Detalle de un Curso

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Ver detalle de un curso existente. | 1. Abrir un curso del catálogo. 2. Observar las pestañas de visión general, temario e instructores. | La API responde HTTP 200 con los datos del curso y sus materias (`GET /api/moocs/courses/:id`). | Éxito |
| 2 | Ver detalle de un curso inexistente. | 1. Solicitar `GET /api/moocs/courses/:id` con un id no registrado. | La API responde HTTP 404 "Curso no encontrado". | Éxito |
| 3 | Ver contenido (diapositivas) de un curso. | 1. Abrir el contenido de un curso (`/curso/:id/contenido`). | `GET /api/moocs/courses/:id/slides` devuelve las diapositivas con video, texto, cuestionarios y recursos (HTTP 200). | Éxito |

### Caso de Uso: Crear Curso (Rol Mentor)

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Creación exitosa de curso con datos válidos. | 1. Iniciar sesión con rol Mentor. 2. Completar los campos obligatorios (título, proveedor, imagen, logo, tipo, categoría). 3. Guardar. | La API responde HTTP 201 con "Curso creado exitosamente" y el id del curso. | Éxito |
| 2 | Creación con campos obligatorios faltantes. | 1. Iniciar sesión con rol Mentor. 2. Dejar vacío al menos un campo obligatorio. 3. Guardar. | La API responde HTTP 400 "El campo <campo> es obligatorio". | Éxito |
| 3 | Creación de curso con rol no Mentor (Emprendedor). | 1. Iniciar sesión con rol Emprendedor. 2. Intentar crear un curso mediante la API. | La API responde HTTP 403 "Solo los mentores pueden acceder a esta función". | Éxito |
| 4 | Creación de curso sin token. | 1. Enviar `POST /api/moocs/courses` sin encabezado de autorización. | La API responde HTTP 401 "Token requerido". | Éxito |

### Caso de Uso: Editar y Eliminar Curso

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Editar un curso existente con sesión válida. | 1. Iniciar sesión. 2. Modificar datos de un curso existente. 3. Guardar. | La API responde HTTP 200 "Curso actualizado exitosamente". | Éxito |
| 2 | Editar un curso inexistente. | 1. Enviar `PUT /api/moocs/courses/:id` con un id no registrado. | La API responde HTTP 404 "Curso no encontrado". | Éxito |
| 3 | Editar un curso sin token. | 1. Enviar `PUT /api/moocs/courses/:id` sin autorización. | La API responde HTTP 401. | Éxito |
| 4 | Eliminar un curso existente. | 1. Iniciar sesión. 2. Eliminar un curso. | La API responde HTTP 200 "Curso eliminado exitosamente". | Éxito |
| 5 | Eliminar un curso inexistente. | 1. Enviar `DELETE /api/moocs/courses/:id` con un id no registrado. | La API responde HTTP 404 "Curso no encontrado". | Éxito |
| 6 | Consultar mis cursos (rol Mentor). | 1. Iniciar sesión con rol Mentor. 2. Acceder a "Mis Cursos". | La API responde HTTP 200 con solo los cursos del mentor autenticado. | Éxito |
| 7 | Consultar mis cursos con rol no Mentor. | 1. Iniciar sesión con rol Emprendedor. 2. Solicitar `GET /api/moocs/my-courses`. | La API responde HTTP 403 "Solo los mentores pueden acceder a esta función". | Éxito |

---

## MÓDULO INCUVALAB — MENTORÍA Y ASIGNACIONES

### Caso de Uso: Visualizar Mentees

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Consultar lista de emprendedores (mentees). | 1. Iniciar sesión. 2. Acceder a la sección de mentees. | La API responde HTTP 200 con los usuarios de rol `Emprendedor`. | Éxito |
| 2 | Consultar mentees sin sesión. | 1. Enviar `GET /api/mentees` sin token. | La API responde HTTP 401 "Acceso no autorizado. Token no proporcionado." | Éxito |

### Caso de Uso: Crear Asignación de Tarea (Mentor)

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Creación exitosa con todos los campos obligatorios. | 1. Iniciar sesión como Mentor. 2. Seleccionar un mentee, título, fase y descripción. 3. Adjuntar archivos permitidos y enlaces. 4. Guardar. | La API responde HTTP 201 "Asignación creada exitosamente" con el id de la asignación. | Éxito |
| 2 | Creación con campos obligatorios faltantes. | 1. Iniciar sesión como Mentor. 2. Dejar vacío el título (o mentee, fase o descripción). 3. Guardar. | La API responde HTTP 400 "Todos los campos son obligatorios". | Éxito |
| 3 | Subida de archivo con formato no soportado. | 1. Adjuntar un archivo de extensión no permitida (ej. `.exe`). 2. Guardar. | La API rechaza el archivo ("Formato de archivo no soportado"). | Éxito |
| 4 | Subida de archivo que supera el tamaño límite (50 MB). | 1. Adjuntar un archivo mayor a 50 MB. 2. Guardar. | La API rechaza la subida por límite de tamaño. | Éxito |

### Caso de Uso: Editar y Entregar Asignación

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Editar una asignación del mentor autenticado. | 1. Iniciar sesión como Mentor. 2. Modificar una asignación propia. 3. Guardar. | La API responde HTTP 200 "Asignación actualizada exitosamente". | Éxito |
| 2 | Editar una asignación de otro mentor. | 1. Iniciar sesión como Mentor. 2. Intentar modificar una asignación ajena. | La API responde HTTP 404 "Asignación no encontrada o no autorizado". | Éxito |
| 3 | Entregar una tarea como emprendedor. | 1. Iniciar sesión como Emprendedor. 2. Subir el archivo de entrega en una asignación propia. 3. Enviar. | La API responde HTTP 200 "Asignación entregada exitosamente" y el estado pasa a entregada. | Éxito |
| 4 | Entregar una tarea que no pertenece al emprendedor. | 1. Iniciar sesión como Emprendedor. 2. Intentar entregar una asignación de otro mentee. | La API responde HTTP 404 "Asignación no encontrada". | Éxito |

### Caso de Uso: Consultar y Eliminar Asignaciones

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Consultar asignaciones del mentor autenticado. | 1. Iniciar sesión como Mentor. 2. Abrir la sección de asignaciones. | La API responde HTTP 200 con las asignaciones activas con la fase en texto (Preincubación, Incubación, Lanzamiento). | Éxito |
| 2 | Consultar mis asignaciones como emprendedor. | 1. Iniciar sesión como Emprendedor. 2. Abrir "Mis Tareas". | La API responde HTTP 200 con las tareas asignadas al mentee con el nombre del mentor. | Éxito |
| 3 | Consultar archivos de una asignación autorizada. | 1. Iniciar sesión. 2. Abrir los archivos de una asignación propia (como mentor o mentee). | La API responde HTTP 200 con el listado de archivos y su autor. | Éxito |
| 4 | Consultar archivos de una asignación no autorizada. | 1. Solicitar `GET /api/assignments/:id/files` de una asignación ajena. | La API responde HTTP 404 "Asignación no encontrada". | Éxito |
| 5 | Eliminar una asignación propia (mentor). | 1. Iniciar sesión como Mentor. 2. Eliminar una asignación propia activa. | La API responde HTTP 200 "Asignación eliminada exitosamente" (eliminación lógica). | Éxito |
| 6 | Eliminar una asignación de otro mentor. | 1. Iniciar sesión como Mentor. 2. Intentar eliminar una asignación ajena. | La API responde HTTP 404 "Asignación no encontrada o no autorizado". | Éxito |

---

## MÓDULO INCUVALAB — GESTIÓN DE CONTENIDOS (PANEL DE ADMINISTRACIÓN)

### Caso de Uso: Gestionar Eventos

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Consultar lista de eventos. | 1. Acceder a la sección de eventos. 2. Observar los eventos. | La API responde HTTP 200 con los eventos ordenados por fecha y hora. | Éxito |
| 2 | Crear evento con campos obligatorios. | 1. Completar título, fecha del evento y lugar. 2. Guardar. | La API responde HTTP 201 con el evento creado. | Éxito |
| 3 | Crear evento sin campos obligatorios. | 1. Dejar vacío el título (o fecha o lugar). 2. Guardar. | La API responde HTTP 400 "Faltan campos requeridos: título, fecha_evento y lugar son obligatorios". | Éxito |
| 4 | Editar un evento existente. | 1. Modificar datos de un evento. 2. Guardar. | La API responde HTTP 200 "Evento actualizado correctamente". | Éxito |
| 5 | Editar un evento inexistente. | 1. Enviar `PUT /api/eventos/:id` con un id no registrado. | La API responde HTTP 404 "Evento no encontrado". | Éxito |
| 6 | Eliminar un evento. | 1. Eliminar un evento existente. | La API responde HTTP 200 "Evento eliminado correctamente". | Éxito |

### Caso de Uso: Gestionar Mentores (Contenido)

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Consultar lista de mentores. | 1. Acceder a la sección de mentores. | La API responde HTTP 200 con nombre, teléfono, área de experiencia y disponibilidad. | Éxito |
| 2 | Crear un mentor. | 1. Completar nombre, teléfono, área de experiencia y disponibilidad. 2. Guardar. | La API responde HTTP 201 con el id del mentor creado. | Éxito |
| 3 | Editar un mentor existente. | 1. Modificar los datos de un mentor. 2. Guardar. | La API responde HTTP 200 "Mentor actualizado correctamente". | Éxito |
| 4 | Eliminar un mentor. | 1. Eliminar un mentor existente. | La API responde HTTP 200 "Mentor eliminado correctamente". | Éxito |

### Caso de Uso: Gestionar Challengers (Retos)

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Consultar lista de challengers. | 1. Acceder a la sección de retos. | La API responde HTTP 200 con el listado completo. | Éxito |
| 2 | Crear un challenger. | 1. Completar título, imagen, fecha, horas y contacto. 2. Guardar. | La API responde HTTP 201 con el registro creado. | Éxito |
| 3 | Consultar un challenger inexistente. | 1. Solicitar `GET /api/challenger/:id` con un id no registrado. | La API responde HTTP 404 "Challenger no encontrado". | Éxito |
| 4 | Editar un challenger existente. | 1. Modificar datos de un reto. 2. Guardar. | La API responde HTTP 200. | Éxito |
| 5 | Eliminar un challenger. | 1. Eliminar un reto existente. | La API responde HTTP 204 sin cuerpo. | Éxito |

### Caso de Uso: Gestionar Inspiring Talks

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Consultar lista de charlas inspiradoras. | 1. Acceder a la sección "Inspiring". | La API responde HTTP 200 con el listado. | Éxito |
| 2 | Crear una charla inspirante. | 1. Completar título, speaker, descripción, imagen y video. 2. Guardar. | La API responde HTTP 201 con el id del registro. | Éxito |
| 3 | Editar una charla existente. | 1. Modificar datos. 2. Guardar. | La API responde HTTP 200 "Inspiring actualizado correctamente". | Éxito |
| 4 | Eliminar una charla. | 1. Eliminar un registro existente. | La API responde HTTP 200 "Inspiring eliminado correctamente". | Éxito |

### Caso de Uso: Gestionar Empresas y Servicios

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Consultar lista de servicios. | 1. Acceder a la sección de empresas/servicios. | La API responde HTTP 200 con el listado. | Éxito |
| 2 | Crear un servicio. | 1. Completar imagen, título, descripción, subtítulo y servicios. 2. Guardar. | La API responde HTTP 201 con el id del servicio. | Éxito |
| 3 | Consultar un servicio inexistente. | 1. Solicitar `GET /api/empresas_servicios/:id` con un id no registrado. | La API responde HTTP 404 "Servicio no encontrado". | Éxito |
| 4 | Editar un servicio existente. | 1. Modificar datos. 2. Guardar. | La API responde HTTP 200 "Servicio actualizado". | Éxito |
| 5 | Eliminar un servicio. | 1. Eliminar un servicio existente. | La API responde HTTP 200 "Servicio eliminado". | Éxito |

### Caso de Uso: Reporte de Mentees (Administrador)

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Consultar avance de un mentee por fase. | 1. Iniciar sesión como Administrador. 2. Acceder al reporte de mentees. | La API responde HTTP 200 con las asignaciones del mentee y su fase de incubación, archivos incluidos. | Éxito |

---

## MÓDULO INCUVALAB — FORMULARIOS DE CAPTACIÓN

### Caso de Uso: Enviar Mensaje de Contacto

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Envío exitoso de mensaje de contacto. | 1. Abrir la página de contacto. 2. Completar nombre, correo, teléfono, tipo de consulta y mensaje. 3. Enviar. | La API responde HTTP 200 con `success: true`. | Éxito |
| 2 | Consultar mensajes de contacto. | 1. Acceder a la sección de administración de contacto. | La API responde HTTP 200 con los mensajes ordenados por fecha de envío. | Éxito |
| 3 | Eliminar un mensaje de contacto. | 1. Eliminar un mensaje existente. | La API responde HTTP 200 con `success: true`. | Éxito |

### Caso de Uso: Enviar Solicitud de Revenue (Inversión)

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Envío exitoso de solicitud de inversión. | 1. Abrir el formulario de revenue. 2. Completar nombre, número de contacto, institución y descripción. 3. Enviar. | La API responde HTTP 200 "Datos de contacto guardados exitosamente". | Éxito |

### Caso de Uso: Registrar Proyecto Estudiantil (Partners)

| Caso de Prueba | Escenario de prueba | Pasos de la prueba | Resultado esperado | Éxito / Fracaso |
|---|---|---|---|---|
| 1 | Registro exitoso de proyecto estudiantil. | 1. Abrir el formulario de partners. 2. Completar datos del estudiante, semestre, carrera, contacto, nombre del proyecto, descripción, tipo y requerimiento. 3. Enviar. | La API responde HTTP 200 "Proyecto registrado exitosamente". | Éxito |

---

## RESUMEN DE RESULTADOS

| Resultado | Cantidad de casos |
|---|---|
| Éxito | 116 |
| Fracaso | 0 |

**Nota:** Los 4 casos que inicialmente resultaron en Fracaso fueron corregidos en el código: validación de campos vacíos, formato de correo, fortaleza de contraseña y control de roles en el registro de usuario (`POST /api/usuario`), devolución del usuario en `GET /api/verify-auth`, y validación del rol Administrador en la ruta `/admin-dashboard` del frontend de Incuvalab.