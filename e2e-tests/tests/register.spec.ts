import { test } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import generateRandomEmail from '../utils/generate-random-email';

test('Użytkownik może się zarejestrować', async ({ page }) => {
    const username = generateRandomEmail();
    const registrationPage = new RegistrationPage(page);
    await registrationPage.visit();
    await registrationPage.register(username, username);
});
