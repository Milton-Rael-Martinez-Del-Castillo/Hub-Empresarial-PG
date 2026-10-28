import { test, expect } from '@playwright/test';

const INCUVALAB_URL = process.env.INCUVALAB_URL || 'http://localhost:8081';

test('Incuvalab: enviar el formulario de contacto y ver la confirmación real del backend', async ({ page }) => {
  const nombres = `Test E2E ${Date.now()}`;
  const correo = `test.${Date.now()}@e2e.test`;
  const telefono = String(77000000 + (Date.now() % 1000000));
  const mensaje = `Mensaje de prueba E2E ${Date.now()}`;

  await page.goto(`${INCUVALAB_URL}/contact`);
  await expect(page.getByRole('heading', { name: '¡Es Fácil Contactarnos!' })).toBeVisible();

  const nombreInput = page.locator('input[name="nombres"]');
  const emailInput = page.locator('input[name="correo"]');
  const telefonoInput = page.locator('input[name="telefono"]');
  const seleccionSelect = page.locator('select[name="seleccion"]');
  const mensajeInput = page.locator('textarea[name="mensaje"]');

  await expect(nombreInput).toBeVisible();

  await nombreInput.fill(nombres);
  await emailInput.fill(correo);
  await telefonoInput.fill(telefono);
  await seleccionSelect.selectOption({ label: 'Consulta general' });
  await mensajeInput.fill(mensaje);

  await page.getByRole('button', { name: 'Enviar mensaje' }).click();

  const confirmacion = page.locator('div.bg-green-100', {
    hasText: 'Mensaje enviado con éxito',
  });

  await expect(confirmacion).toBeVisible({ timeout: 10_000 });
  await expect(confirmacion).toHaveText(
    '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.'
  );

  await expect(page.locator('div.bg-red-100')).toHaveCount(0);

  await expect(nombreInput).toHaveValue('');
  await expect(emailInput).toHaveValue('');
  await expect(telefonoInput).toHaveValue('');
});