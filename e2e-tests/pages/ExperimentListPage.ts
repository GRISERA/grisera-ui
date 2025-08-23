import { BasePage } from './BasePage';

export class ExperimentListPage extends BasePage {
    async visit(): Promise<void> {
        await this.page.goto('/experiments');
        await this.waitForPageLoad();
    }

    async useAnyExperiment(): Promise<void> {
        await this.page.getByText('Go to details').first().click();
        await this.page.waitForURL('/experiments/**');
        await this.waitForPageLoad();
    }

    async useExperimentByName(name: string): Promise<void> {
        await this.visit();
        await this.page.locator(`tr:has([test-data="${ name }"])`).getByRole('button', { name: 'Go to details' }).click();
        await this.page.waitForURL('/experiments/**');
        await this.waitForPageLoad();
    }

    async usingAnyExperiment(): Promise<void> {
        await this.visit();
        await this.waitForPageLoad();
        await this.useAnyExperiment();
    }
}
