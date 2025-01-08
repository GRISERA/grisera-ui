import { test, expect } from '@playwright/test';

test('register new user', async ({ page }) => {
    const username = `user-${ Date.now().toString().slice(5) }@example.com`;
    await page.goto('/login');
    await page.getByRole('link', { name: 'Register now' }).click();
    await page.getByLabel('Email address').click();
    await page.getByLabel('Email address').fill(username);
    await page.getByLabel('Email address').press('Tab');
    await page.getByLabel('Password', { exact: true }).click();
    await page.getByLabel('Password', { exact: true }).fill(username);
    await page.getByLabel('Password', { exact: true }).press('Tab');
    await page.getByLabel('Confirm password').fill(username);
    await page.locator('.v-input--selection-controls__ripple').click();
    const responsePromise = page.waitForResponse('**/api/register');
    await page.getByRole('button', { name: 'create account' }).click();
    const response = await responsePromise;
    await expect(response.status()).toBe(201);
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
});
