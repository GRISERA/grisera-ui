import { test } from '@playwright/test';
import { DatasetCreatePage } from '../pages/DatasetCreatePage';
import { LoginPage } from '../pages/LoginPage';
import { DatasetListPage } from '../pages/DatasetListPage';

test.beforeEach(async ({ page }) => new LoginPage(page).loggedInAsDefaultUser());

test('Użytkownik może utworzyć nowy zbiór danych', async ({ page }) => {
    const newDataset = {
        name: 'Inconsistency dataset',
        creator: 'Gdańsk University of Technology',
        rights: 'Creative Commons Attribution 4.0 International License',
        date: '2025-02-28',
        description: `The dataset from Gdańsk University of Technology results from an experiment where facial expressions were recorded using four cameras placed at the corners of a screen. The goal was to recognize emotional states using three systems: Noldus FaceReader, QuantumLab Express Engine, and Luxand-based. FaceReader identified nine emotional states, including six basic Ekman emotions, neutral, and PAD model's valence and arousal. QuantumLab Express Engine recognized five basic emotions (excluding fear) and neutral, while Luxand identified six basic emotions and neutral. The experiment analyzed consistency between systems and cameras, as well as the impact of variables like sex, glasses, and facial hair. Twelve participants recorded their faces while completing tasks on an e-learning platform.`,
    };

    const datasetPage = new DatasetCreatePage(page);
    await datasetPage.visit();
    await datasetPage.createDataset(newDataset);

    const datasetListPage = new DatasetListPage(page);
    await datasetListPage.visit();
    await datasetListPage.waitForPageLoad();
    await datasetListPage.verifyDatasetDetails(newDataset);
});
