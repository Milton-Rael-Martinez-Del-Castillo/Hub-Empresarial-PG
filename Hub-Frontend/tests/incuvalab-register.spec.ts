import { test, expect } from '@playwright/test';

const INCUVALAB_URL = process.env.INCUVALAB_URL || 'http://localhost:8081';

test('Incuvalab: registrar un usuario nuevo y ver la confirmación real del backend', async ({ page }) => {
  const correo = `e2e.registro.${Date.now()}@test.com`;
  const password = `E2e!${Date.now()}Pass`;

  await page.goto(`${INCUVALAB_URL}/register`);
  await expect(
    page.getByRole('heading', { name: 'Crea una cuenta con tu correo electrónico' })
  ).toBeVisible();

  await page.locator('input[name="email"]').fill(correo);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('input[name="confirmPassword"]').fill(password);
  await page.locator('select[name="rol"]').selectOption({ label: 'Estudiante' });

  await expect(page.locator('div.bg-green-100')).toHaveCount(0);

  await page.getByRole('button', { name: 'Registrarse' }).click();

  const confirmacion = page.locator('div.bg-green-100', { hasText: 'Usuario registrado correctamente' });
  await expect(confirmacion).toBeVisible({ timeout: 10_000 });

  await expect(page).toHaveURL(/\/login$/, { timeout: 10_000 });
});