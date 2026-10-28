import { test, expect } from '@playwright/test';

test('NAE: enviar solicitud de asesoría y ver la confirmación real del backend', async ({ page }) => {
  const nombre = `Test E2E ${Date.now()}`;
  const correo = `test.${Date.now()}@e2e.test`;

  await page.goto('/');

  const linkNae = page.locator('header nav a[href="/nae"]');
  await expect(linkNae).toBeVisible();
  await linkNae.click();

  await expect(page.getByRole('heading', { level: 1, name: 'NAE' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Solicitar Asesoría' })).toBeVisible();

  const nombreInput = page.locator('input[placeholder="Ej. Juan Pérez"]');
  const emailInput = page.locator('input[placeholder="juan@correo.com"]');
  await expect(nombreInput).toBeVisible();
  await expect(emailInput).toBeVisible();

  await nombreInput.fill(nombre);
  await emailInput.fill(correo);

  await page.getByRole('button', { name: 'Enviar Solicitud' }).click();

  const mensajeEsperado = `Gracias ${nombre}, tu solicitud de asesoría fue enviada correctamente.`;
  const confirmacion = page.locator('div.bg-green-50', {
    hasText: 'enviada correctamente',
  });

  await expect(confirmacion).toBeVisible({ timeout: 10_000 });
  await expect(confirmacion).toHaveText(mensajeEsperado);

  await expect(page.getByText('Hubo un problema al enviar la solicitud. Inténtalo nuevamente.')).toHaveCount(0);

  await expect(nombreInput).toHaveValue('');
  await expect(emailInput).toHaveValue('');
});