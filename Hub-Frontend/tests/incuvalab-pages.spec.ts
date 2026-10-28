import { test, expect } from '@playwright/test';

const INCUVALAB_URL = process.env.INCUVALAB_URL || 'http://localhost:8081';

const PAGINAS_PUBLICAS = [
  '/',
  '/quienes-somos',
  '/servicios',
  '/servicios/revenue',
  '/servicios/partners',
  '/servicios/inspiring',
  '/servicios/challengers',
  '/mentoring',
  '/eventos',
  '/contact',
  '/developers',
  '/crowdfunding',
];

for (const path of PAGINAS_PUBLICAS) {
  test(`Incuvalab: la página pública ${path} carga sin errores`, async ({ page }) => {
    const errores = [] as string[];
    page.on('pageerror', (err) => errores.push(err.message));

    await page.goto(`${INCUVALAB_URL}${path}`);

    await expect(page).toHaveURL(new RegExp(`${path.replace(/\//g, '\\/')}$`));
    await expect(page.locator('nav').first()).toBeVisible();

    expect(errores).toEqual([]);
  });
}