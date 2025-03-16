import {expect, test} from "@playwright/test";
import {LoginPage} from "../pages/LoginPage";
import {DatasetListPage} from "../pages/DatasetListPage";
import {ExperimentPage} from "../pages/ExperimentPage";
import {ParticipantsTab} from "../pages/ParticipantsTab";
import {ScenariosTab} from "../pages/ScenariosTab";

test.beforeEach(async ({ page })=> {
    await new LoginPage(page).loggedInAsDefaultUser();
    await new DatasetListPage(page).usingAnyDataset();
    await new ExperimentPage(page).useAnyExperiment();
});

test('Użytkownik może dodać scenariusz do eksperymentu', async ({ page }) => {

    const scenariosTab = new ScenariosTab(page);
    await scenariosTab.visit();
    await scenariosTab.addScenario(
        'Online Learning Session Emotional Response',
        "This scenario tracks a user's emotional response throughout an online learning session.",
    ['Answering Initial Metric Questions']
    );

    await scenariosTab.visit();
    await expect(page.getByRole('button', { name: 'Online Learning Session Emotional Response' }).first()).toBeVisible();
});
