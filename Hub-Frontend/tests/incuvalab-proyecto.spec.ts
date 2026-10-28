import { test, expect } from '@playwright/test';

const INCUVALAB_URL = process.env.INCUVALAB_URL || 'http://localhost:8081';

test('Incuvalab: registrar un proyecto en Partners y ver el modal de éxito real', async ({ page }) => {
  const sufijo = Date.now();

  await page.goto(`${INCUVALAB_URL}/crud-partner`);
  await expect(page.getByRole('heading', { name: 'Registro de Proyecto' })).toBeVisible();

  await page.locator('input[name="nombre_estudiante"]').fill(`Estudiante E2E ${sufijo}`);
  await page.locator('select[name="semestre"]').selectOption({ label: 'Semestre 1' });
  await page.locator('input[name="carrera"]').fill('Sistemas');
  await page.locator('input[name="contacto"]').fill('77712345');
  await page.locator('input[name="nombre_proyecto"]').fill(`Proyecto E2E ${sufijo}`);
  await page
    .locator('textarea[name="descripcion_proyecto"]')
    .fill(`Descripción del proyecto de prueba ${sufijo}`);
  await page.locator('select[name="tipo_proyecto"]').selectOption({ label: 'Proyecto de aula' });
  await page.locator('textarea[name="requerimiento"]').fill(`Requerimiento de prueba ${sufijo}`);

  await page.getByRole('button', { name: 'Enviar', exact: true }).click();

  await expect(
    page.getByRole('heading', { name: '¡Formulario enviado!' })
  ).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText('Tu proyecto fue registrado exitosamente.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Error' })).toHaveCount(0);
});