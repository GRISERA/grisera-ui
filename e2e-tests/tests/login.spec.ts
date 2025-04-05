import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Użytkownik może się zalogować', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.visit();
    await loginPage.login('test@example.com', 'test@example.com');
    await loginPage.verifyLoggedIn('test@example.com');
});
