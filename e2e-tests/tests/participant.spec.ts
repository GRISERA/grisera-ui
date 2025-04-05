import { test, expect } from '@playwright/test';
import { ParticipantCreatePage } from '../pages/ParticipantCreatePage';
import { LoginPage } from '../pages/LoginPage';
import { DatasetListPage } from '../pages/DatasetListPage';

test.beforeEach(async ({ page }) => {
    await new LoginPage(page).loggedInAsDefaultUser();
    await new DatasetListPage(page).usingAnyDataset();
});

test('Użytkownik może utworzyć nowego uczestnika 1', async ({ page }) => {
    const participantPage = new ParticipantCreatePage(page);
    await participantPage.visit();
    await participantPage.fillParticipantForm({
        name: 'James',
        surname: 'Anderson',
        birthDate: '1992-07-01',
        sex: 'Male',
    });
    await participantPage.submitForm();

    await expect(page).toHaveURL('/participants');
    await expect(page.locator('text=James Anderson').last()).toBeVisible();
});

test('Użytkownik może utworzyć nowego uczestnika 2', async ({ page }) => {
    const participantPage = new ParticipantCreatePage(page);
    await participantPage.visit();
    await participantPage.fillParticipantForm({
        name: 'Emma',
        surname: 'Carter',
        birthDate: '1987-03-01',
        sex: 'Female',
    });
    await participantPage.submitForm();

    await expect(page).toHaveURL('/participants');
    await expect(page.locator('text=Emma Carter').last()).toBeVisible();
});

test('Użytkownik może utworzyć nowego uczestnika 3', async ({ page }) => {
    const participantPage = new ParticipantCreatePage(page);
    await participantPage.visit();
    await participantPage.fillParticipantForm({
        name: 'Caroline',
        surname: 'Kane',
        birthDate: '1999-01-01',
        sex: 'Female',
    });
    await participantPage.submitForm();

    await expect(page).toHaveURL('/participants');
    await expect(page.locator('text=Caroline Kane').last()).toBeVisible();
});
