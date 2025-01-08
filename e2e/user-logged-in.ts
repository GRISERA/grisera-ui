import { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export default async ({ page }: { page: Page }) => {
    await page.goto('/login');
    await page.getByLabel('Login').click();
    await page.getByLabel('Login').fill('test@example.com');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('test@example.com');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByText('test@example.com')).toBeVisible();
};
