import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DatasetListPage } from '../pages/DatasetListPage';
import { ExperimentPage } from '../pages/ExperimentPage';
import { ParticipantsTab } from '../pages/ParticipantsTab';

test.beforeEach(async ({ page }) => {
    await new LoginPage(page).loggedInAsDefaultUser();
    await new DatasetListPage(page).usingAnyDataset();
    await new ExperimentPage(page).useAnyExperiment();
});

test('Użytkownik może dodać uczestnika do eksperymentu', async ({ page }) => {

    const participantsTab = new ParticipantsTab(page);

    await participantsTab.visit();

    await participantsTab.addParticipant('James Anderson');

    await expect(page.getByRole('cell', { name: 'James' }).first()).toBeVisible();
});
