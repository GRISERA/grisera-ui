import {expect, test} from "@playwright/test";
import {LoginPage} from "../pages/LoginPage";
import {DatasetListPage} from "../pages/DatasetListPage";
import {ExperimentPage} from "../pages/ExperimentPage";
import {ParticipantsTab} from "../pages/ParticipantsTab";
import {ScenariosTab} from "../pages/ScenariosTab";
import {ScenariosExecutionsTab} from "../pages/ScenariosExecutionsTab";

test.beforeEach(async ({ page })=> {
    await new LoginPage(page).loggedInAsDefaultUser();
    await new DatasetListPage(page).usingAnyDataset();
    await new ExperimentPage(page).useAnyExperiment();
});

test('Użytkownik może dodać wykonanie scenariusza', async ({ page }) => {


    const scenariosExecutionTab = new ScenariosExecutionsTab(page);
    await scenariosExecutionTab.visit();
    await scenariosExecutionTab.addScenarioExecution(
        'Online Learning Session Emotional Response',
        'ex-01'
    );

    await scenariosExecutionTab.visit();
    await expect(page.getByRole('button', { name: 'ex-01' }).first()).toBeVisible();
});
