import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DatasetListPage extends BasePage {
    async visit(): Promise<void> {
        await this.page.goto('/datasets');
        await this.waitForPageLoad();
    }

    datasetCardWithName(name: string) {
        return this.page.locator('.dataset-card', { hasText: name }).last();
    }

    async verifyDatasetDetails(dataset: {
        name: string;
        creator: string;
        rights: string;
        date: string;
        description: string;
    }): Promise<void> {
        const card = this.datasetCardWithName(dataset.name);
        await expect(card).toContainText(dataset.name);
        await expect(card).toContainText(dataset.creator);
        await expect(card).toContainText(dataset.rights);
        await expect(card).toContainText(dataset.date);
        await expect(card).toContainText(dataset.description);
    }
}
