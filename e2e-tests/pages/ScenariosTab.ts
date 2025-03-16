import {BasePage} from "./BasePage";

export class ScenariosTab extends BasePage{
    async visit(): Promise<void> {
        await this.page.getByRole('tab', { name: 'Scenarios', exact: true }).click();
    }

    async addScenario(name: string, description: string, activities: string[]): Promise<void> {
        await this.page.getByRole('button', { name: 'Create' }).click();
        await this.page.getByLabel('Name').fill(name);
        await this.page.getByLabel('Description').fill(description);

        for (const activityName of activities) {
            await this.page.getByRole('button', { name: 'Add next activity' }).click();
            await this.page.getByLabel('Activity').click();
            await this.page.locator('div.v-list-item', { hasText: activityName }).first().click();
            await this.page.getByRole('button', { name: 'Add' }).click();
        }

        await this.page.getByRole('button', { name: 'Create' }).click();
    }
}
