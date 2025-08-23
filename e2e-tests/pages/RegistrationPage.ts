import { expect, Response } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegistrationPage extends BasePage {
    async visit(): Promise<void> {
        await this.page.goto('/register');
        await this.waitForPageLoad();
    }

    private get emailField() {
        return this.page.getByLabel('Email address');
    }

    private get passwordField() {
        return this.page.getByLabel('Password', { exact: true });
    }

    private get confirmPasswordField() {
        return this.page.getByLabel('Confirm password');
    }

    private get termsCheckbox() {
        return this.page.locator('.v-input--selection-controls__ripple');
    }

    private get createAccountButton() {
        return this.page.getByRole('button', { name: 'create account' });
    }

    async fillRegistrationForm(email: string, password: string): Promise<void> {
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.confirmPasswordField.fill(password);
        await this.termsCheckbox.click();
    }

    async submitForm(): Promise<void> {
        await this.createAccountButton.click();
    }

    async register(email: string, password: string): Promise<Response> {
        await this.fillRegistrationForm(email, password);
        const responsePromise = this.page.waitForResponse('**/api/register');
        await this.submitForm();
        const response = await responsePromise;
        await expect(response.status()).toBe(201);
        await this.page.waitForURL('/login');
        await expect(this.page).toHaveURL('/login');
    }
}
