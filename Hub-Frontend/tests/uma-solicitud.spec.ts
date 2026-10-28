import { test, expect } from '@playwright/test';

test('UMA: enviar solicitud de desarrollo y ver la confirmación real del backend', async ({ page }) => {
  const nombre = `Test E2E ${Date.now()}`;
  const correo = `test.${Date.now()}@e2e.test`;
  const mensaje = `Necesito una solución de software de prueba ${Date.now()}`;

  await page.goto('/');

  const linkUma = page.locator('header nav a[href="/uma"]');
  await expect(linkUma).toBeVisible();
  await linkUma.click();

  await expect(page.getByRole('heading', { level: 1, name: 'UMA' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Solicitar Desarrollos' })).toBeVisible();

  const nombreInput = page.locator('input[placeholder="Ej. María López"]');
  const emailInput = page.locator('input[placeholder="maria@correo.com"]');
  const mensajeInput = page.locator('textarea[placeholder="Cuéntanos qué solución necesitas..."]');
  await expect(nombreInput).toBeVisible();
  await expect(emailInput).toBeVisible();
  await expect(mensajeInput).toBeVisible();

  await nombreInput.fill(nombre);
  await emailInput.fill(correo);
  await mensajeInput.fill(mensaje);

  await page.getByRole('button', { name: 'Enviar Solicitud' }).click();

  const mensajeEsperado = `Gracias ${nombre}, tu solicitud fue enviada correctamente.`;
  const confirmacion = page.locator('div.bg-green-50', {
    hasText: 'tu solicitud fue enviada correctamente',
  });

  await expect(confirmacion).toBeVisible({ timeout: 10_000 });
  await expect(confirmacion).toHaveText(mensajeEsperado);

  await expect(page.getByText('Hubo un problema al enviar la solicitud. Inténtalo nuevamente.')).toHaveCount(0);

  await expect(nombreInput).toHaveValue('');
  await expect(emailInput).toHaveValue('');
  await expect(mensajeInput).toHaveValue('');
});