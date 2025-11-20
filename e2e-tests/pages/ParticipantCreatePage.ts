import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ParticipantCreatePage extends BasePage {
    async visit(): Promise<void> {
        await this.page.goto('/participants/create');
        await this.waitForPageLoad();
    }

    private get nameInput(): Locator {
        return this.page.getByLabel('Name', { exact: true });
    }

    private get surnameInput(): Locator {
        return this.page.getByLabel('Surname', { exact: true });
    }

    private get birthDateInput(): Locator {
        return this.page.getByLabel('Date of birth');
    }

    private get sexSelect(): Locator {
        return this.page.getByLabel('Sex');
    }

    private get createButton(): Locator {
        return this.page.getByRole('button', { name: 'Create new participant' });
    }

    async selectDate(date: string): Promise<void> {
        await this.birthDateInput.click();
        const day = new Date(date).getDate().toString();
        await this.page.getByRole('button', { name: day }).first().click();
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    async selectSex(sex: string): Promise<void> {
        await this.sexSelect.click();
        await this.page.getByText(sex, { exact: true }).click();
    }

    async fillParticipantForm({ name, surname, birthDate, sex }) {
        await this.nameInput.fill(`${ name } ${ surname }`);
        await this.surnameInput.fill(surname);
        await this.selectDate(birthDate);
        await this.selectSex(sex);
    }

    async submitForm() {
        await this.createButton.click();
    }
}
