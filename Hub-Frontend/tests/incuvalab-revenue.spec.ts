import { test, expect } from '@playwright/test';

const INCUVALAB_URL = process.env.INCUVALAB_URL || 'http://localhost:8081';

test('Incuvalab: enviar el formulario de Revenue y ver el modal de éxito real', async ({ page }) => {
  const sufijo = Date.now();

  await page.goto(`${INCUVALAB_URL}/crud-revenue`);
  await expect(page.getByRole('heading', { name: 'Formulario de Contacto' })).toBeVisible();

  await page.locator('input[name="nombre"]').fill(`Contacto E2E ${sufijo}`);
  await page.locator('input[name="contacto"]').fill('77712345');
  await page.locator('input[name="institucion"]').fill(`Institución E2E ${sufijo}`);
  await page
    .locator('textarea[name="descripcion"]')
    .fill(`Descripción del apoyo solicitado de prueba ${sufijo}`);

  await page.getByRole('button', { name: 'Enviar', exact: true }).click();

  await expect(
    page.getByRole('heading', { name: '¡Formulario enviado!' })
  ).toBeVisible({ timeout: 10_000 });
  await expect(
    page.getByText('Gracias por contactarnos. Pronto nos pondremos en contacto contigo.')
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Error' })).toHaveCount(0);
});