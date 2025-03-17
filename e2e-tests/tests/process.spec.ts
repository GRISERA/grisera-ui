import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DatasetCreatePage } from '../pages/DatasetCreatePage';
import { DatasetListPage } from '../pages/DatasetListPage';
import { ParticipantCreatePage } from '../pages/ParticipantCreatePage';
import { ExperimentPage } from '../pages/ExperimentPage';
import { ActivityPage } from '../pages/ActivityPage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { ParticipantsTab } from '../pages/ParticipantsTab';
import { ExperimentListPage } from '../pages/ExperimentListPage';
import { ScenariosTab } from '../pages/ScenariosTab';
import { ScenariosExecutionsTab } from '../pages/ScenariosExecutionsTab';

const newDataset = {
    name: 'Inconsistency dataset',
    creator: 'Gdańsk University of Technology',
    rights: 'Creative Commons Attribution 4.0 International License',
    date: '2025-03-01',
    description: `The dataset from Gdańsk University of Technology results from an experiment where facial expressions were recorded using four cameras placed at the corners of a screen. The goal was to recognize emotional states using three systems: Noldus FaceReader, QuantumLab Express Engine, and Luxand-based. FaceReader identified nine emotional states, including six basic Ekman emotions, neutral, and PAD model's valence and arousal. QuantumLab Express Engine recognized five basic emotions (excluding fear) and neutral, while Luxand identified six basic emotions and neutral. The experiment analyzed consistency between systems and cameras, as well as the impact of variables like sex, glasses, and facial hair. Twelve participants recorded their faces while completing tasks on an e-learning platform.`,
};

const newExperiment = {
    name: 'Emotion recognition',
    author: 'Gdańsk University of Technology',
    description: 'Multi-camera facial expression analysis with multiple recognition systems.',
    footnote: '-',
};

const newParticipants = [
    {
        name: 'James',
        surname: 'Anderson',
        birthDate: '1992-07-01',
        sex: 'Male',
    },
    {
        name: 'Emma',
        surname: 'Carter',
        birthDate: '1987-03-01',
        sex: 'Female',
    },
    {
        name: 'Caroline',
        surname: 'Kane',
        birthDate: '1999-01-01',
        sex: 'Female',
    },
];

const newActivities = [
    {
        name: 'Answering Initial Metric Questions',
        description: 'Participants answer questions to assess their familiarity with the Moodle platform.',
        type: 'Individual',
        participants: ['James Anderson'],
    },
    {
        name: 'Logging into the Learning Platform',
        description: 'Participants perform a task involving logging into the Moodle e-learning platform.',
        type: 'Individual',
        participants: ['James Anderson'],
    },
    {
        name: 'Locating a Course',
        description: 'Participants search for and locate a specific course on the Moodle platform.',
        type: 'Individual',
        participants: ['James Anderson'],
    },
    {
        name: 'Completing an Emotional State Questionnaire',
        description: 'Participants fill out questionnaires regarding their emotional state at different points during the experiment.',
        type: 'Individual',
        participants: ['James Anderson'],
    },
    {
        name: 'Listening to a Lecture',
        description: 'Participants listen to a pre-recorded lecture on an assigned topic.',
        type: 'Individual',
        participants: ['James Anderson'],
    },
    {
        name: 'Completing a Quiz',
        description: 'Participants answer questions related to the material presented in the lecture.',
        type: 'Individual',
        participants: ['James Anderson'],
    },
    // {
    //     name: 'Listening to a Lecture',
    //     description: 'Participants listen to a lecture on an assigned topic.',
    //     type: 'Group',
    //     participants: ['James Anderson', 'Emma Carter', 'Caroline Kane'],
    // },
    // {
    //     name: 'Discussion and Joint Analysis',
    //     description: 'Two participants summarize the lecture, ask each other clarifying questions, and collaboratively identify key points for deeper understanding.',
    //     type: 'Two persons activity',
    //     participants: ['James Anderson', 'Emma Carter'],
    // },
];

const newScenario = {
    name: 'Online Learning Session Emotional Response',
    description: 'This scenario tracks a user\'s emotional response throughout an online learning session.',
    activities: newActivities.map(e => e.name),
};

const newScenarioExecutions = [
    {
        scenarioName: newScenario.name,
        executionName: 'ex-01',
    },
    {
        scenarioName: newScenario.name,
        executionName: 'ex-02',
    },
];

test.beforeEach(async ({ page }) => new LoginPage(page).loggedInAsDefaultUser());

test.describe.serial('Przejście całego procesu', () => {
    test('[01] - Użytkownik tworzy nowy zbiór danych', async ({ page }) => {
        const datasetPage = new DatasetCreatePage(page);
        await datasetPage.visit();
        await datasetPage.createDataset(newDataset);
        const datasetListPage = new DatasetListPage(page);
        await datasetListPage.visit();
        await datasetListPage.waitForPageLoad();
        await datasetListPage.verifyDatasetDetails(newDataset);
        await datasetListPage.useDatasetByName(newDataset.name);
    });

    test('[02] - Użytkownik tworzy uczestników', async ({ page }) => {
        await (new DatasetListPage(page)).useDatasetByName(newDataset.name);

        for (const newParticipant of newParticipants) {
            const participantPage = new ParticipantCreatePage(page);
            await participantPage.visit();
            await participantPage.fillParticipantForm(newParticipant);
            await participantPage.submitForm();
            await expect(page).toHaveURL('/participants');
            await expect(page.locator(`text=${ newParticipant.name } ${ newParticipant.surname }`).last()).toBeVisible();
        }
    });

    test('[03] - Użytkownik tworzy eksperyment', async ({ page }) => {
        await (new DatasetListPage(page)).useDatasetByName(newDataset.name);

        const experimentPage = new ExperimentPage(page);
        await experimentPage.visit();
        await experimentPage.createExperiment(newExperiment);
        await page.getByRole('cell', { name: newExperiment.name }).last().click();
    });

    test('[04] - Użytkownik tworzy aktywności', async ({ page }) => {
        await (new DatasetListPage(page)).useDatasetByName(newDataset.name);

        const activityPage = new ActivityPage(page);
        await activityPage.visit();

        for (const newActivity of newActivities) {
            await activityPage.createActivity(newActivity.name, newActivity.description, newActivity.type);
            await expect(page.getByRole('cell', { name: newActivity.name }).last()).toBeVisible();
        }
    });

    test('[05] - Użytkownik dodaje uczestników do eksperymentu', async ({ page }) => {
        await (new DatasetListPage(page)).useDatasetByName(newDataset.name);
        await (new ExperimentListPage(page)).useExperimentByName(newExperiment.name);

        for (const newParticipant of newParticipants) {
            const participantsTab = new ParticipantsTab(page);
            await participantsTab.visit();
            await participantsTab.addParticipant(`${ newParticipant.surname } ${ newParticipant.name }`);
            await expect(page.getByRole('cell', { name: newParticipant.name }).first()).toBeVisible();
        }
    });

    test('[06] - Użytkownik dodaje scenariusz testowy', async ({ page }) => {
        await (new DatasetListPage(page)).useDatasetByName(newDataset.name);
        await (new ExperimentListPage(page)).useExperimentByName(newExperiment.name);

        const scenariosTab = new ScenariosTab(page);
        await scenariosTab.visit();
        await scenariosTab.addScenario(newScenario);

        await scenariosTab.visit();
        await expect(page.getByRole('button', { name: newScenario.name }).first()).toBeVisible();
    });

    test('[07] - Użytkownik dodaje wykonania scenariusza', async ({ page }) => {
        await (new DatasetListPage(page)).useDatasetByName(newDataset.name);
        await (new ExperimentListPage(page)).useExperimentByName(newExperiment.name);

        for (const newScenarioExecution of newScenarioExecutions) {
            const scenariosExecutionTab = new ScenariosExecutionsTab(page);
            await scenariosExecutionTab.visit();
            await scenariosExecutionTab.addScenarioExecution(newScenarioExecution.scenarioName, newScenarioExecution.executionName);
            await scenariosExecutionTab.visit();
            await expect(page.getByRole('button', { name: newScenarioExecution.executionName }).first()).toBeVisible();
        }
    });

    test('[08] - Użytkownik dodaje uczestnika do wykonania scenariusza', async ({ page }) => {
        await (new DatasetListPage(page)).useDatasetByName(newDataset.name);
        await (new ExperimentListPage(page)).useExperimentByName(newExperiment.name);

        for (const scenarioExecution of newScenarioExecutions) {
            let count = 1;
            for (const newActivity of newActivities) {
                for (const participant of newActivity.participants) {
                    const scenariosExecutionTab = new ScenariosExecutionsTab(page);
                    await scenariosExecutionTab.visit();
                    await scenariosExecutionTab.addParticipantToScenariosActivity({
                        participantName: participant,
                        activityName: `Activity Execution: ${ count }`,
                        scenarioExecutionName: scenarioExecution.executionName,
                    });
                }
                count++;
            }
        }
    });
});
