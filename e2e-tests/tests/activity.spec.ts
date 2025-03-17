import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ActivityPage } from '../pages/ActivityPage';
import { DatasetListPage } from '../pages/DatasetListPage';

test.beforeEach(async ({ page }) => {
    await new LoginPage(page).loggedInAsDefaultUser();
    await new DatasetListPage(page).usingAnyDataset();
});
test('Użytkownik może stworzyć nowe aktywności', async ({ page }) => {
    const activities = [
        {
            name: 'Answering Initial Metric Questions',
            description: 'Participants answer questions to assess their familiarity with the Moodle platform.',
            type: 'Individual',
        },
        {
            name: 'Logging into the Learning Platform',
            description: 'Participants perform a task involving logging into the Moodle e-learning platform.',
            type: 'Individual',
        },
        {
            name: 'Locating a Course',
            description: 'Participants search for and locate a specific course on the Moodle platform.',
            type: 'Individual',
        },
        {
            name: 'Completing an Emotional State Questionnaire',
            description: 'Participants fill out questionnaires regarding their emotional state at different points during the experiment.',
            type: 'Individual',
        },
        {
            name: 'Listening to a Lecture',
            description: 'Participants listen to a pre-recorded lecture on an assigned topic.',
            type: 'Individual',
        },
        {
            name: 'Completing a Quiz',
            description: 'Participants answer questions related to the material presented in the lecture.',
            type: 'Individual',
        },
        { name: 'Listening to a Lecture', description: 'Participants listen to a lecture on an assigned topic.', type: 'Group' },
        {
            name: 'Discussion and Joint Analysis',
            description: 'Two participants summarize the lecture, ask each other clarifying questions, and collaboratively identify key points for deeper understanding.',
            type: 'Two persons activity',
        },
    ];

    const activityPage = new ActivityPage(page);
    await activityPage.visit();

    for (const activity of activities) {
        await activityPage.createActivity(activity.name, activity.description, activity.type);
        await expect(page.getByRole('cell', { name: 'Answering Initial Metric' }).last()).toBeVisible();
    }
});
