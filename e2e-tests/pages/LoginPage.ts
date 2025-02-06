import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    private get loginInput() {
        return this.page.getByLabel('Login');
    }

    private get passwordInput() {
        return this.page.getByLabel('Password');
    }

    private get loginButton() {
        return this.page.getByRole('button', { name: 'Log in' });
    }

    async visit(): Promise<void> {
        await this.page.goto('/login');
        await this.waitForPageLoad();
    }

    async login(email: string, password: string): Promise<void> {
        await this.loginInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async loggedInAsDefaultUser(): Promise<void> {
        await this.visit();
        await this.login('test@example.com', 'test@example.com');
        await this.verifyLoggedIn('test@example.com');
    }

    async verifyLoggedIn(email: string): Promise<void> {
        await expect(this.page.getByText(email)).toBeVisible();
    }
}
