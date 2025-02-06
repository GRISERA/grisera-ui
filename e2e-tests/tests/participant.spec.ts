import { test, expect } from '@playwright/test';
import { ParticipantCreatePage } from '../pages/ParticipantCreatePage';
import { LoginPage } from '../pages/LoginPage';
import { DatasetListPage } from '../pages/DatasetListPage';

test.beforeEach(async ({ page }) => {
    await new LoginPage(page).loggedInAsDefaultUser();
    await new DatasetListPage(page).usingAnyDataset();
});

test('Użytkownik może utworzyć nowego uczestnika', async ({ page }) => {
    const participantPage = new ParticipantCreatePage(page);
    await participantPage.visit();
    await participantPage.fillParticipantForm(
        'James',
        'Anderson',
        '1992-07-01',
        'Male',
    );
    await participantPage.submitForm();

    await expect(page).toHaveURL('/participants');
    await expect(page.locator('text=James Anderson').last()).toBeVisible();
});
