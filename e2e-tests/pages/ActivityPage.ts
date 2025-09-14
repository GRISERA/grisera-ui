import {BasePage} from "./BasePage";

export class ActivityPage extends BasePage {
    async visit(): Promise<void> {
        await this.page.goto('/activities');
        await this.waitForPageLoad();
    }

    private get createButton() {
        return this.page.getByRole('button', { name: 'Create' });
    }

    private get nameInput() {
        return this.page.getByLabel('Name');
    }

    private get descriptionInput() {
        return this.page.getByLabel('Description');
    }

    private get typeDropdown() {
        return this.page.getByLabel('Type');
    }

    private get createActivityButton() {
        return this.page.getByRole('button', { name: 'Create new activity' });
    }


    async createActivity(name: string, description: string, type: string): Promise<void> {
        await this.createButton.click();
        await this.waitForPageLoad();
        await this.nameInput.fill(name);
        await this.descriptionInput.fill(description);
        await this.typeDropdown.click();
        await this.page.getByText(type).click();
        await this.createActivityButton.click();
    }
}
