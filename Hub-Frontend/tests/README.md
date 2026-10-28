# Pruebas E2E (caja negra) con Playwright

Pruebas de extremo a extremo que validan el flujo del **Hub Empresarial**
desde el navegador: Hub-Frontend (`http://localhost:8080`) + Hub-Backend
(`http://localhost:8083`).

## Requisitos previos

1. Levantar todos los servicios con Docker (frontend en `:8080`, backend en
   `:8083`, y también **Incuvalab**: frontend `:8081` / backend `:8000`):

   ```bash
   docker compose up --build -d
   ```

   El `baseURL` está configurado en `playwright.config.ts` apuntando a
   `http://localhost:8080`; por eso no se repite la URL en cada test. El test
   de Incuvalab usa una URL absoluta (`http://localhost:8081`) y se puede
   ajustar con la variable de entorno `INCUVALAB_URL`.

2. Instalar dependencias (la primera vez):

   ```bash
   npm install
   ```

   Los navegadores de Playwright se descargan con:

   ```bash
   npx playwright install chromium
   ```

   (ya quedaron instalados cuando se inicializó el proyecto).

## Cómo correr las pruebas

Desde la raíz de `Hub-Frontend`:

```bash
npm run test:e2e        # ejecuta todos los tests (consola + reporte HTML)
npm run test:e2e:ui      # abre la interfaz visual de Playwright para depurar
```

También puedes correr un solo archivo o abrir el reporte:

```bash
npx playwright test nae-solicitud   # solo el test de NAE
npx playwright show-report           # abre el último reporte HTML
```

## Qué cubren

- `nae-solicitud.spec.ts` — navega al home, entra a la sección **NAE**, llena
  el formulario con datos únicos (timestamp), lo envía y verifica que aparezca
  el mensaje de confirmación real del backend (el `201` de
  `POST /api/nae/solicitudes`), no el `alert()` viejo.
- `uma-solicitud.spec.ts` — igual pero para la sección **UMA** (`/uma`,
  `POST /api/uma/solicitudes`), incluyendo el campo mensaje.
- `incuvalab-contact.spec.ts` — abre el frontend de **Incuvalab**
  (`http://localhost:8081/contact`), llena y envía el formulario de contacto
  (`POST http://localhost:8000/api/contacto` del backend de Incuvalab) y
  verifica el mensaje de éxito real del backend.
- `incuvalab-register.spec.ts` — registra un usuario nuevo en **Incuvalab**
  (`/register`) con datos únicos y verifica el mensaje «Usuario registrado
  correctamente» y la redirección a `/login`.
- `incuvalab-login.spec.ts` — crea un usuario administrador vía API, inicia
  sesión en `/login` y verifica la redirección a `/admin-dashboard` y el
  título «Panel de Administrador».
- `incuvalab-proyecto.spec.ts` — llena y envía el formulario de registro de
  proyectos (`/crud-partner`, `POST /api/proyectos`) y verifica el modal de
  éxito real.
- `incuvalab-revenue.spec.ts` — llena y envía el formulario de contacto de
  Revenue (`/crud-revenue`, `POST /api/revenue`) y verifica el modal de éxito
  real.
- `incuvalab-pages.spec.ts` — smoke test: 12 páginas públicas de Incuvalab
  cargan sin errores no capturados y con navegación visible.
- `admin-login.spec.ts` — inicia sesión con las credenciales del admin por
  defecto, verifica la redirección a `/admin` y que la pestaña **Solicitudes
  NAE** esté visible y activa.

Los tests de Incuvalab apuntan al frontend con la variable `INCUVALAB_URL`
(`http://localhost:8081`) y al backend con `INCUVALAB_API_URL`
(`http://localhost:8000`); ambos requieren que el servicio `incuvalab-backend`
esté corriendo (docker compose).

## Credenciales por defecto (admin)

```text
Correo:    admin@univalle.edu
Contraseña: Univalle1234!
```

Son las del seed (`HUB_ADMIN_DEFAULT_*` en el `.env` de la raíz).

## Diagnóstico de fallos

- Si los servicios no están corriendo, los tests fallan al no poder cargar
  `localhost:8080`. Verifica con `docker compose ps`.
- Los inputs de los formularios no tienen `id`/`name`, por eso los tests los
  localizan por `placeholder`. Si cambian esos atributos, hay que actualizar
  los selectores.