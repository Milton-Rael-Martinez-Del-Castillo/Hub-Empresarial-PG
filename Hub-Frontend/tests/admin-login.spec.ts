import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@univalle.edu';
const ADMIN_PASSWORD = 'Univalle1234!';

test('Admin: iniciar sesión, redirigir al dashboard y ver la pestaña Solicitudes NAE', async ({ page }) => {
  await page.goto('/admin/login');
  await expect(page.getByRole('heading', { name: 'Acceso Administrador' })).toBeVisible();

  await page.getByPlaceholder('admin@univalle.edu').fill(ADMIN_EMAIL);
  await page.getByPlaceholder('••••••••').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Ingresar' }).click();

  await expect(page).toHaveURL(/\/admin(\?tab=\w+)?/);
  await expect(page.getByRole('heading', { name: 'Panel Administrador' })).toBeVisible();

  const tabNae = page.getByRole('button', { name: 'Solicitudes NAE' });
  await expect(tabNae).toBeVisible();
  await expect(tabNae).toHaveClass(/bg-\[\#880043\]/);
});