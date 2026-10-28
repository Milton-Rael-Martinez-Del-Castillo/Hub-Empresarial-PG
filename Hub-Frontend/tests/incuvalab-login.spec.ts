import { test, expect } from '@playwright/test';

const INCUVALAB_URL = process.env.INCUVALAB_URL || 'http://localhost:8081';
const ADMIN_EMAIL = 'admin@incuvalab.edu';
const ADMIN_PASSWORD = 'Univalle1234!';

test('Incuvalab: iniciar sesión como administrador y llegar al panel', async ({ page }) => {
  await page.goto(`${INCUVALAB_URL}/login`);
  await expect(
    page.getByRole('heading', { name: 'Inicia sesión con tu correo electrónico' })
  ).toBeVisible();

  await page.locator('input[name="email"]').fill(ADMIN_EMAIL);
  await page.locator('input[name="password"]').fill(ADMIN_PASSWORD);

  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  await expect(page).toHaveURL(/\/admin-dashboard/, { timeout: 10_000 });
  await expect(page.getByRole('heading', { name: 'Panel de Administrador' })).toBeVisible();
});