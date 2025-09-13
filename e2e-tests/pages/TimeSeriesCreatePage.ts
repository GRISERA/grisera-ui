//
//
// test('test', async ({ page }) => {
//     await page.goto('http://localhost:8080/datasets');
//     await page.getByRole('button', { name: 'select and proceed' }).click();
//     await page.getByRole('link', { name: 'Experiments' }).click();
//     await page.getByRole('button', { name: 'Go to details' }).click();
//     await page.getByRole('tab', { name: 'Scenarios executions' }).click();
//     await page.getByRole('button', { name: 'Scenario ex 1 󰆴' }).click();
//     await page.getByRole('button', { name: '󰅀' }).first().click();
//     await page.getByRole('button', { name: 'Time Series' }).click();
//     await page.getByRole('button', { name: 'Create' }).click();


//     await page.getByLabel('Link').click();
//     await page.getByLabel('Link').fill('asdasd@test.com');
//     await page.locator('div').filter({ hasText: /^Timestamp$/ }).locator('div').nth(1).click();
//     await page.locator('div').filter({ hasText: /^Regular$/ }).locator('div').nth(1).click();

//     await page.getByRole('option', { name: '' }).click();
//     await page.getByRole('button', { name: 'Create' }).click();
//     await page.getByLabel('Link').click();
//     await page.getByLabel('Link').press('ControlOrMeta+a');
//     await page.getByLabel('Link').fill('https://wp.pl');
//     await page.getByRole('button', { name: 'Create' }).click();
//     await expect(page.getByRole('cell', { name: 'https://wp.pl' })).toBeVisible();
//     await expect(page.getByRole('cell', { name: 'Familiarity' }).first()).toBeVisible();
// });

import { BasePage } from './BasePage';
import { expect, Locator } from '@playwright/test';

export class TimeSeriesCreatePage extends BasePage {
    async visit(): Promise<void> {
        await this.waitForPageLoad();
    }

    async openForm(): Promise<void> {
        await this.page.getByRole('button', { name: 'Create New Time Series' }).click();
    }

    private get linkInput(): Locator {
        return this.page.getByLabel('Link', { exact: true });
    }

    async selectType(name: string): Promise<void> {
        if ('Epoch' === name) {
            return await this.page.locator('div')
                .filter({ hasText: /^Epoch/ })
                .locator('div')
                .nth(1)
                .click();
        }

        if ('Timestamp' === name) {
            return await this.page.locator('div')
                .filter({ hasText: /^Timestamp$/ })
                .locator('div')
                .nth(1)
                .click();
        }
    }

    async selectSpacing(name: string): Promise<void> {
        if ('Irregular' === name) {
            return await this.page.locator('div')
                .filter({ hasText: /^Irregular/ })
                .locator('div')
                .nth(1)
                .click();
        }

        if ('Regular' === name) {
            return await this.page.locator('div')
                .filter({ hasText: /^Regular$/ })
                .locator('div')
                .nth(1)
                .click();
        }
    }

    async selectMeasure(name: string): Promise<void> {
        await this.page.getByLabel('Measure').click();
        await this.page.getByRole('option', { name }).click();
    }

    async selectRecording(name: string): Promise<void> {
        await this.page.getByLabel('Recording').click();
        await this.page.getByRole('option', { name: `(recording name: ${ name })` }).click();
    }

    async selectChannel(name: string): Promise<void> {
        await this.page.getByLabel('Channel').click();
        await this.page.getByRole('option', { name }).click();
    }

    async selectModality(name: string): Promise<void> {
        await this.page.getByLabel('Modality').click();
        await this.page.getByRole('option', { name }).click();
    }

    async selectLiveActivity(name: string): Promise<void> {
        await this.page.getByLabel('Live activity').click();
        await this.page.getByRole('option', { name }).click();
    }

    private get createButton(): Locator {
        return this.page.getByRole('button', { name: 'Create time series' });
    }

    async fillForm({ filePath, type, spacing, measure, recording, channel, modality, liveActivity }): Promise<void> {
        await this.page.getByLabel('File input').setInputFiles(filePath);
        await this.selectType(type);
        await this.selectSpacing(spacing);
        await this.selectMeasure(measure);
        await this.selectRecording(recording);
        await this.selectChannel(channel);
        await this.selectModality(modality);
        await this.selectLiveActivity(liveActivity);
    }

    async submitForm() {
        await this.createButton.click();
    }
}
