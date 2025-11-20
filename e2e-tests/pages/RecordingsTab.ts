import { BasePage } from './BasePage';

export class RecordingsTab extends BasePage {
    async visit(): Promise<void> {
        await this.page.getByRole('tab', { name: 'Recordings' }).click();
    }

    async addRecording({ scenarioExecutionName, activityExecutionName, name, description, filePath, channel, participant }): Promise<void> {
        await this.page.getByRole('button', { name: 'Create New Recording' }).click();
        await this.page.getByLabel('Scenario Executions').click();
        await this.page.getByRole('option', { name: scenarioExecutionName }).click();
        await this.page.getByLabel('Activity Execution').click();
        await this.page.getByRole('option', { name: activityExecutionName }).click();
        await this.page.getByLabel('Name').click();
        await this.page.getByLabel('Name').fill(name);
        await this.page.getByLabel('Description').click();
        await this.page.getByLabel('Description').fill(description);
        await this.page.getByLabel('Channel').click();
        await this.page.getByRole('option', { name: channel }).click();
        await this.page.getByLabel('Participants').click();
        await this.page.getByRole('option', { name: participant }).click();
        await this.page.getByRole('button', { name: 'Create Recording' }).click();
        await this.page.waitForURL('/experiments/**');
    }
}
