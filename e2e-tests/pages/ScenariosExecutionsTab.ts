import {BasePage} from "./BasePage";

export class ScenariosExecutionsTab extends BasePage {
    async visit(): Promise<void> {
        await this.page.getByRole('tab', {name: 'Scenarios Executions'}).click();
    }

    async addScenarioExecution(scenarioName: string, executionName: string): Promise<void> {
        await this.page.getByLabel('Scenarios').click()

        await this.page.locator('div[role="option"]').filter({hasText: scenarioName}).first().click();

        await this.page.getByLabel('Name').fill(executionName);

        await this.page.getByRole('button', {name: 'Create'}).click();
    }

    async addParticipantJamesToScenario(button: any): Promise<void> {

        await button.click();

        await this.page.getByLabel('Participants').click();

        await this.page.locator('div[role="option"]:has-text("James")').first().click();

        await this.page.getByRole('button', {name: 'Update'}).click();
    }


}
