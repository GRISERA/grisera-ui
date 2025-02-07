import {expect, test} from '@playwright/test';
import {LoginPage} from "../pages/LoginPage";
import {DatasetListPage} from "../pages/DatasetListPage";
import {ExperimentPage} from "../pages/ExperimentPage";
test.beforeEach(async ({ page })=> {
    await new LoginPage(page).loggedInAsDefaultUser();
    await new DatasetListPage(page).usingAnyDataset();
});


test('Użytkownik może stworzyć nowy eksperyment', async ({ page }) => {
    const experimentPage = new ExperimentPage(page);

    await experimentPage.visit();
    await experimentPage.createExperiment(
        'Emotion recognition',
        'Gdańsk University of Technology',
        'Multi-camera facial expression analysis with multiple recognition systems.',
        '-'
    );

    await page.getByRole('cell', { name: 'Emotion recognition' }).last().click();
});