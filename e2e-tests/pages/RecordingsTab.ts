import { BasePage } from './BasePage';

export class RecordingsTab extends BasePage {
    async visit(): Promise<void> {
        await this.page.getByRole('tab', { name: 'Recordings' }).click();
    }

    async addRecording({ scenarioExecutionName, activityExecutionName, name, description, filePath, channel, participant }): Promise<void> {
        await this.page.getByRole('button', { name: 'Create' }).click();

        await this.page.getByLabel('Scenario Executions').click();
        await this.page.locator('div[role="option"]').filter({ hasText: scenarioExecutionName }).first().click();

        await this.page.getByLabel('Activity Execution').click();
        await this.page.locator('div[role="option"]').filter({ hasText: activityExecutionName }).first().click();

        await this.page.getByLabel('Name').fill(name);

        await this.page.getByLabel('Description').fill(description);

        await this.page.getByLabel('File input').setInputFiles(filePath);

        await this.page.getByLabel('Channel').click();
        await this.page.locator('div[role="option"]').filter({ hasText: channel }).first().click();

        await this.page.getByLabel('Participants').click();
        await this.page.locator('div[role="option"]').filter({ hasText: participant }).first().click();

        await this.page.getByRole('button', { name: 'Create Recording' }).click();
        await this.page.waitForURL('/experiments/**');
    }
}
