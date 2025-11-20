import { BasePage } from './BasePage';

export class ExperimentPage extends BasePage {

    async useAnyExperiment(): Promise<void> {
        await this.visit();
        await this.page.getByTestId('go-to-details-button').first().click();
    }


    private get createButton() {
        return this.page.getByRole('button', { name: 'Create' });
    }

    private get nameInput() {
        return this.page.getByLabel('Name');
    }

    private get authorInput() {
        return this.page.getByLabel('Author');
    }

    private get descriptionInput() {
        return this.page.getByLabel('Description');
    }

    private get footnoteInput() {
        return this.page.getByLabel('Footnote');
    }

    private get createExperimentButton() {
        return this.page.getByRole('button', { name: 'Create experiment' });
    }

    async visit(): Promise<void> {
        await this.page.goto('/experiments');
        await this.waitForPageLoad();
    }

    async createExperiment({ name, author, description, footnote }): Promise<void> {
        await this.createButton.click();
        await this.page.waitForURL('/experiments/create');
        await this.nameInput.fill(name);
        await this.authorInput.fill(author);
        await this.descriptionInput.fill(description);
        await this.footnoteInput.fill(footnote);
        await this.createExperimentButton.click();
    }
}