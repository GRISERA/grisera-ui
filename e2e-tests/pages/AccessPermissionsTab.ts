import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccessPermissionsTab extends BasePage {
    async visit(): Promise<void> {
        await this.page.getByRole('tab', { name: 'Access Permissions' }).click();
    }

    private get usernameInput() {
        return this.page.getByRole('textbox', { name: 'Username' });
    }

    private get roleInput() {
        return this.page.getByRole('textbox', { name: 'Role' });
    }

    private get addButton() {
        return this.page.getByRole('Button', {name: 'add'});
    }

    async addPermission(username: string, role: string) {
        await this.usernameInput.fill(username);
        await this.page.getByRole('option', { name: username }).click();

        await this.roleInput.click();
        await this.page.getByRole("option", {name: role}).click();


        await this.addButton.click();
        await expect(this.page.getByRole("cell", {name: username})).toBeVisible();
        await expect(this.page.getByRole("cell", {name: role})).toBeVisible();

    }
}


