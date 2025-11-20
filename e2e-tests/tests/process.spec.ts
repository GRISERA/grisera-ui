import {expect, Page, test as base} from '@playwright/test';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { DatasetCreatePage } from '../pages/DatasetCreatePage';
import { DatasetListPage } from '../pages/DatasetListPage';
import { ParticipantCreatePage } from '../pages/ParticipantCreatePage';
import { ExperimentPage } from '../pages/ExperimentPage';
import { ActivityPage } from '../pages/ActivityPage';
import { ParticipantsTab } from '../pages/ParticipantsTab';
import { ExperimentListPage } from '../pages/ExperimentListPage';
import { ScenariosTab } from '../pages/ScenariosTab';
import { ScenariosExecutionsTab } from '../pages/ScenariosExecutionsTab';
import { RecordingsTab } from '../pages/RecordingsTab';
import { RegistrationPage } from '../pages/RegistrationPage';
import {SettingsPage} from "../pages/SettingsPage";
import {AccessPermissionsTab} from "../pages/AccessPermissionsTab";
import generateDate from '../utils/generate-date-util';
import { TimeSeriesCreatePage } from '../pages/TimeSeriesCreatePage';

const hash = Math.random().toString(36).substring(2);

const firstDayOfMonth = generateDate(1);


const newDataset = {
    name: `Inconsistency dataset ${ hash }`,
    creator: 'Gdańsk University of Technology',
    rights: 'Creative Commons Attribution 4.0 International License',
    date: firstDayOfMonth,
    description: `The dataset from Gdańsk University of Technology results from an experiment where facial expressions were recorded using four cameras placed at the corners of a screen. The goal was to recognize emotional states using three systems: Noldus FaceReader, QuantumLab Express Engine, and Luxand-based. FaceReader identified nine emotional states, including six basic Ekman emotions, neutral, and PAD model's valence and arousal. QuantumLab Express Engine recognized five basic emotions (excluding fear) and neutral, while Luxand identified six basic emotions and neutral. The experiment analyzed consistency between systems and cameras, as well as the impact of variables like sex, glasses, and facial hair. Twelve participants recorded their faces while completing tasks on an e-learning platform.`,
};

const newExperiment = {
    name: `Emotion recognition ${ hash }`,
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
    // {
    //     name: 'Emma',
    //     surname: 'Carter',
    //     birthDate: '1987-03-01',
    //     sex: 'Female',
    // },
    // {
    //     name: 'Caroline',
    //     surname: 'Kane',
    //     birthDate: '1999-01-01',
    //     sex: 'Female',
    // },
];

const newActivities = [
    {
        name: 'Answering Initial Metric Questions',
        description: 'Participants answer questions to assess their familiarity with the Moodle platform.',
        type: 'Individual',
        participants: ['James Anderson'],
    },
    // {
    //     name: 'Logging into the Learning Platform',
    //     description: 'Participants perform a task involving logging into the Moodle e-learning platform.',
    //     type: 'Individual',
    //     participants: ['James Anderson'],
    // },
    // {
    //     name: 'Locating a Course',
    //     description: 'Participants search for and locate a specific course on the Moodle platform.',
    //     type: 'Individual',
    //     participants: ['James Anderson'],
    // },
    // {
    //     name: 'Completing an Emotional State Questionnaire',
    //     description: 'Participants fill out questionnaires regarding their emotional state at different points during the experiment.',
    //     type: 'Individual',
    //     participants: ['James Anderson'],
    // },
    // {
    //     name: 'Listening to a Lecture',
    //     description: 'Participants listen to a pre-recorded lecture on an assigned topic.',
    //     type: 'Individual',
    //     participants: ['James Anderson'],
    // },
    // {
    //     name: 'Completing a Quiz',
    //     description: 'Participants answer questions related to the material presented in the lecture.',
    //     type: 'Individual',
    //     participants: ['James Anderson'],
    // },
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
    // {
    //     scenarioName: newScenario.name,
    //     executionName: 'ex-02',
    // },
];


const newRecordings = [
    {
        scenarioExecutionName: 'ex-01',
        activityExecutionName: 'Activity Execution: 1',
        name: 'Audio Recording 1',
        description: 'Audio recording for individual activity execution 1.',
        filePath: path.join(__dirname, '../test-files/audio_sample.wav'),
        channel: 'Audio',
        participant: 'James Anderson',
    },
    // {
    //     scenarioExecutionName: 'ex-01',
    //     activityExecutionName: 'Activity Execution: 2',
    //     name: 'BVP Recording 2',
    //     description: 'BVP recording for individual activity execution 2.',
    //     filePath: path.join(__dirname, '../test-files/data_sample.csv'),
    //     channel: 'BVP',
    //     participant: 'James Anderson',
    // },
    // {
    //     scenarioExecutionName: 'ex-01',
    //     activityExecutionName: 'Activity Execution: 3',
    //     name: 'ECG Recording 3',
    //     description: 'ECG recording for individual activity execution 3.',
    //     filePath: path.join(__dirname, '../test-files/text_sample.txt'),
    //     channel: 'ECG',
    //     participant: 'James Anderson',
    // },
    // {
    //     scenarioExecutionName: 'ex-01',
    //     activityExecutionName: 'Activity Execution: 4',
    //     name: 'EDA Recording 4',
    //     description: 'EDA recording for individual activity execution 4.',
    //     filePath: path.join(__dirname, '../test-files/video_sample.mp4'),
    //     channel: 'EDA',
    //     participant: 'James Anderson',
    // },
];

const newTimeSeries = [
  {
    scenarioExecution: 'ex-01',
    activityExecution: 'Activity Execution: 1',
    filePath: path.join(__dirname, '../test-files/audio_sample.wav'),
    type: 'Epoch',
    spacing: 'Regular',
    measure: 'Sadness',
    recording: 'Audio Recording 1',
    channel: 'Audio',
    modality: 'Prosody of speech',
    liveActivity: 'Sound',
  }
];

const username = `${ hash }`;
const firstName = `${ hash }FirstName`;
const lastName = `${ hash }LastName`;
const email = `${ hash }@example.com`;

const usernameOther = `other${ hash }`;
const emailOther = `other${ hash }@example.com`;
const firstNameOther = `other${ hash }FirstName`;
const lastNameOther = `other${ hash }LastName`;

type LoggedInFixtures = {
    userPage: Page;
    otherUserPage: Page;
};

const test = base.extend<LoggedInFixtures>({
    userPage: async({page}, use) => {
        const loginPage = await new LoginPage(page);
        await loginPage.loggedInAsUser({ email, password: email })
        await use(page)
    },

    otherUserPage: async({page}, use) => {
        const loginPage = await new LoginPage(page);
        await loginPage.loggedInAsUser({ email: emailOther, password: emailOther })
        await use(page)
    }
});

test.describe.serial('Przejście całego procesu', () => {
    test('[00] - Użytkownik rejestruje konto', async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await registrationPage.visit();
        await registrationPage.register(username, email, email, firstName, lastName);
    });

    test('[01] - Użytkownik tworzy zbiór danych', async ({ userPage }) => {
        const datasetPage = new DatasetCreatePage(userPage);
        await datasetPage.visit();
        await datasetPage.createDataset(newDataset);
        const datasetListPage = new DatasetListPage(userPage);
        await datasetListPage.visit();
        await datasetListPage.waitForPageLoad();
        await datasetListPage.verifyDatasetDetails(newDataset);
        await datasetListPage.useDatasetByName(newDataset.name);
    });

    test('[02] - Użytkownik tworzy uczestników', async ({ userPage }) => {
        await selectDataset(userPage);

        for (const newParticipant of newParticipants) {
            const participantPage = new ParticipantCreatePage(userPage);
            await participantPage.visit();
            await participantPage.fillParticipantForm(newParticipant);
            await participantPage.submitForm();
            await expect(userPage).toHaveURL('/participants');
            await expect(userPage.locator(`text=${ newParticipant.name } ${ newParticipant.surname }`).last()).toBeVisible();
        }
    });

    test('[03] - Użytkownik tworzy eksperyment', async ({ userPage }) => {
        await selectDataset(userPage);

        const experimentPage = new ExperimentPage(userPage);
        await experimentPage.visit();
        await experimentPage.createExperiment(newExperiment);
        await userPage.getByRole('cell', { name: newExperiment.name }).last().click();
    });

    test('[04] - Użytkownik tworzy aktywności', async ({ userPage }) => {
        await selectDataset(userPage);

        const activityPage = new ActivityPage(userPage);
        await activityPage.visit();

        for (const newActivity of newActivities) {
            await activityPage.createActivity(newActivity.name, newActivity.description, newActivity.type);
            await expect(userPage.getByRole('cell', { name: newActivity.name }).last()).toBeVisible();
        }
    });

    test('[05] - Użytkownik dodaje uczestników do eksperymentu', async ({ userPage }) => {
        await selectDataset(userPage);
        await (new ExperimentListPage(userPage)).useExperimentByName(newExperiment.name);

        for (const newParticipant of newParticipants) {
            const participantsTab = new ParticipantsTab(userPage);
            await participantsTab.visit();
            await participantsTab.addParticipant(`${ newParticipant.name } ${ newParticipant.surname }`);
            await expect(userPage.getByRole('cell', { name: newParticipant.name }).first()).toBeVisible();
        }
    });

    test('[06] - Użytkownik tworzy scenariusz testowy', async ({ userPage }) => {
        await selectDataset(userPage);
        await (new ExperimentListPage(userPage)).useExperimentByName(newExperiment.name);

        const scenariosTab = new ScenariosTab(userPage);
        await scenariosTab.visit();
        await scenariosTab.addScenario(newScenario);

        await scenariosTab.visit();
        await expect(userPage.getByRole('button', { name: newScenario.name }).first()).toBeVisible();
    });

    test('[07] - Użytkownik dodaje wykonania scenariusza', async ({ userPage }) => {
        await selectDataset(userPage);
        await (new ExperimentListPage(userPage)).useExperimentByName(newExperiment.name);

        for (const newScenarioExecution of newScenarioExecutions) {
            const scenariosExecutionTab = new ScenariosExecutionsTab(userPage);
            await scenariosExecutionTab.visit();
            await scenariosExecutionTab.addScenarioExecution(newScenarioExecution.scenarioName, newScenarioExecution.executionName);
            await scenariosExecutionTab.visit();
            await expect(userPage.getByRole('button', { name: newScenarioExecution.executionName }).first()).toBeVisible();
        }
    });

    test('[08] - Użytkownik dodaje uczestników do wykonań scenariusza', async ({ userPage }) => {
        await selectDataset(userPage);
        await (new ExperimentListPage(userPage)).useExperimentByName(newExperiment.name);

        for (const scenarioExecution of newScenarioExecutions) {
            let count = 1;
            for (const newActivity of newActivities) {
                for (const participant of newActivity.participants) {
                    const scenariosExecutionTab = new ScenariosExecutionsTab(userPage);
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

    test('[09] - Użytkownik tworzy nagrania', async ({ userPage }) => {
        await selectDataset(userPage);
        await (new ExperimentListPage(userPage)).useExperimentByName(newExperiment.name);

        for (const recording of newRecordings) {
            const recordingsTab = new RecordingsTab(userPage);
            await recordingsTab.visit();
            await recordingsTab.addRecording(recording);
        }
    });

    test('[10] - Użytkownik tworzy szeregi czasowe', async ({ userPage }) => {
        await selectDataset(userPage);
        await (new ExperimentListPage(userPage)).useExperimentByName(newExperiment.name);

        for (const timeSeries of newTimeSeries) {
            await (new ScenariosExecutionsTab(userPage)).useTimeSeriesForAnyParticipant(timeSeries);
            const timeSeriesCreatePage = new TimeSeriesCreatePage(userPage);
            await timeSeriesCreatePage.openForm();
            await timeSeriesCreatePage.fillForm(timeSeries);
            await timeSeriesCreatePage.submitForm();
        }
    });

    test('[11] - Inny użytkownik rejestruje konto', async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await registrationPage.visit();
        await registrationPage.register(usernameOther, emailOther, emailOther, firstNameOther, lastNameOther);
    });

    test('[12] - Użytkownik dodaje uprawnienia dostępu', async ({ userPage }) => {
        await selectDataset(userPage);
        await new SettingsPage(userPage).visit();
        const accessPermissionsTab = new AccessPermissionsTab(userPage);
        await accessPermissionsTab.visit();
        await accessPermissionsTab.addPermission(usernameOther, 'Reader');
    });

    test('[13] - Inny użytkownik nie może tworzyć eksperymentu', async ({ otherUserPage }) => {
        await selectDataset(otherUserPage);

        const experimentPage = new ExperimentPage(otherUserPage);
        await experimentPage.visit();
        await expect(otherUserPage.getByRole('Button', { name: 'Create' }).first()).toHaveCount(0);
    });

    test('[14] - Inny użytkownik nie może edytować składowych eksperymentu', async ({ otherUserPage }) => {
        await selectDataset(otherUserPage);

        await (new ExperimentListPage(otherUserPage)).useExperimentByName(newExperiment.name);

        const participantsTab = new ParticipantsTab(otherUserPage);
        await participantsTab.visit();
        await expect(otherUserPage.getByRole('Button', { name: 'Add' }).first()).toHaveCount(0);

        const scenariosTab = new ScenariosTab(otherUserPage);
        await scenariosTab.visit();
        await expect(otherUserPage.getByRole('Button', { name: 'Create' }).first()).toHaveCount(0);

        const scenariosExecutionTab = new ScenariosExecutionsTab(otherUserPage);
        await scenariosExecutionTab.visit();
        await expect(otherUserPage.getByRole('Button', { name: 'Create' }).first()).toHaveCount(0);

        const recordingsTab = new RecordingsTab(otherUserPage);
        await recordingsTab.visit();
        await expect(otherUserPage.getByRole('Button', { name: 'Create' }).first()).toHaveCount(0);
    });
});

async function selectDataset(page: Page) {
    const datasetPage = new DatasetListPage(page);
    await datasetPage.visit()
    await datasetPage.useDatasetByName(newDataset.name);
}
