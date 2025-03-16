import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DatasetListPage } from '../pages/DatasetListPage';
import { TimeSeriesCreatePage } from '../pages/TimeSeriesCreatePage';

test.beforeEach(async ({ page }) => {
    await new LoginPage(page).loggedInAsDefaultUser();
    await new DatasetListPage(page).usingAnyDataset();
});

test('Użytkownik może utworzyć nowy szeregi czasowe', async ({ page }) => {
    const activityData = [
        {
            link: 'https://www.test2.com',
            type: 'Epoch',
            spacing: 'Regular',
            measure: 'Sadness',
            recording: 'Audio Recording 1',
            channel: 'Audio',
            modality: 'Prosody of speech',
            liveActivity: 'Sound',
        },
        // {
        //     link: 'https://www.test2.com',
        //     type: 'Timestamp',
        //     spacing: 'Irregular',
        //     measure: 'Surprise',
        //     recording: 'BVP Recording 2',
        //     channel: 'BVP',
        //     modality: 'Heart rate',
        //     liveActivity: 'Heart activity',
        // },
        // {
        //     link: 'https://www.test2.com',
        //     type: 'Epoch',
        //     spacing: 'Regular',
        //     measure: 'Neutral state',
        //     recording: 'ECG Recording 3',
        //     channel: 'ECG',
        //     modality: 'HRV',
        //     liveActivity: 'Heart activity',
        // },
        // {
        //     link: 'https://www.test2.com',
        //     type: 'Timestamp',
        //     spacing: 'Irregular',
        //     measure: 'Dominance',
        //     recording: 'EDA Recording 4',
        //     channel: 'EDA',
        //     modality: 'Skin conductance',
        //     liveActivity: 'Perspiration',
        // },
        // {
        //     link: 'https://www.test2.com',
        //     type: 'Epoch',
        //     spacing: 'Regular',
        //     measure: 'Arousal',
        //     recording: 'Depth Video 5',
        //     channel: 'Depth video',
        //     modality: 'Muscle tension',
        //     liveActivity: 'Muscles activity',
        // },
        // {
        //     link: 'https://www.test2.com',
        //     type: 'Timestamp',
        //     spacing: 'Irregular',
        //     measure: 'Valence',
        //     recording: 'RGB Video 6',
        //     channel: 'RGB video',
        //     modality: 'RESP intensity',
        //     liveActivity: 'Respiration',
        // },
        // {
        //     link: 'https://www.test2.com',
        //     type: 'Epoch',
        //     spacing: 'Regular',
        //     measure: 'Familiarity Liking',
        //     recording: 'Group EEG Recording 7',
        //     channel: 'EEG',
        //     modality: 'Neural activity',
        //     liveActivity: 'Brain activity',
        // },
        // {
        //     link: 'https://www.test2.com',
        //     type: 'Timestamp',
        //     spacing: 'Irregular',
        //     measure: 'Anger',
        //     recording: 'Temperature Recording 8',
        //     channel: 'Temperature',
        //     modality: 'Head movement',
        //     liveActivity: 'Movement',
        // },
    ];

    for (const timeSeriesData of activityData) {
        const timeSeriesCreatePage = new TimeSeriesCreatePage(page);
        await timeSeriesCreatePage.visit();
        await timeSeriesCreatePage.fillForm(timeSeriesData);
        await timeSeriesCreatePage.submitForm();

        await expect(page.getByRole('cell', { name: timeSeriesData.measure }).first()).toBeVisible();
        await expect(page.getByRole('cell', { name: timeSeriesData.link }).first()).toBeVisible();
        await expect(page.getByRole('cell', { name: timeSeriesData.type }).first()).toBeVisible();
        await expect(page.getByRole('cell', { name: timeSeriesData.spacing }).first()).toBeVisible();
    }
});
