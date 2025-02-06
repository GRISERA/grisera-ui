import { BasePage } from './BasePage';

export class DatasetCreatePage extends BasePage {
    async visit(): Promise<void> {
        await this.page.goto('/datasets/create');
        await this.waitForPageLoad();
    }

    private get nameField() {
        return this.page.getByLabel('Name');
    }

    private get creatorField() {
        return this.page.getByLabel('Creator');
    }

    private get rightsField() {
        return this.page.getByLabel('Rights');
    }

    private get dateField() {
        return this.page.getByLabel('Date');
    }

    private get descriptionField() {
        return this.page.getByLabel('Description');
    }

    private get cancelButton() {
        return this.page.getByRole('button', { name: 'Cancel' });
    }

    private get submitButton() {
        return this.page.getByRole('button', { name: 'create' });
    }

    async fillName(name: string): Promise<void> {
        await this.nameField.fill(name);
    }

    async fillCreator(creator: string): Promise<void> {
        await this.creatorField.fill(creator);
    }

    async fillRights(rights: string): Promise<void> {
        await this.rightsField.fill(rights);
    }

    async fillDescription(description: string): Promise<void> {
        await this.descriptionField.fill(description);
    }

    async selectDate(date: string): Promise<void> {
        await this.dateField.click();
        const day = new Date(date).getDate().toString();
        await this.page.getByRole('button', { name: day }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    async submitForm(): Promise<void> {
        await this.submitButton.click({ force: true });
        await this.page.waitForURL('/datasets');
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async createDataset(dataset: {
        name: string;
        creator: string;
        rights: string;
        date: string;
        description: string;
    }): Promise<void> {
        await this.fillName(dataset.name);
        await this.fillCreator(dataset.creator);
        await this.fillRights(dataset.rights);
        await this.selectDate(dataset.date);
        await this.fillDescription(dataset.description);
        await this.submitForm();
    }
}
