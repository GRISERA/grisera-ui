import { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class DatasetsPage {

    constructor(public readonly page: Page) {

    }

    async createDataset() {
        await this.page.goto('/datasets/create');
        await this.page.getByLabel('Name').click();
        await this.page.getByLabel('Name').fill('Inconsistency dataset');
        await this.page.getByLabel('Creator').click();
        await this.page.getByLabel('Creator').fill('Gdańsk University of Technology');
        await this.page.getByLabel('Rights').click();
        await this.page.getByLabel('Rights').fill('Creative Commons Attribution 4.0 International License');
        await this.page.getByLabel('Date').click();
        await this.page.getByRole('button', { name: 'January' }).click();
        await this.page.getByRole('button', { name: '2025', exact: true }).click();
        await this.page.getByText('2023').click();
        await this.page.getByRole('button', { name: 'Jan' }).click();
        await this.page.getByRole('button', { name: '1', exact: true }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();
        await this.page.getByLabel('Description').click();
        await this.page.getByLabel('Description').fill('The dataset from Gdańsk University of Technology results from an experiment where facial expressions were recorded using four cameras placed at the corners of a screen. The goal was to recognize emotional states using three systems: Noldus FaceReader, QuantumLab Express Engine, and Luxand-based. FaceReader identified nine emotional states, including six basic Ekman emotions, neutral, and PAD model\'s valence and arousal. QuantumLab Express Engine recognized five basic emotions (excluding fear) and neutral, while Luxand identified six basic emotions and neutral. The experiment analyzed consistency between systems and cameras, as well as the impact of variables like sex, glasses, and facial hair. Twelve participants recorded their faces while completing tasks on an e-learning platform.');
        await this.page.getByRole('button', { name: 'create' }).click();
        await this.page.goto('/datasets');
        await expect(page.getByText('Inconsistency dataset')).toBeVisible();
    }

}
