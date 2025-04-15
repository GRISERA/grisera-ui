import { expect, Response } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegistrationPage extends BasePage {
    async visit(): Promise<void> {
        await this.page.goto('/');
        await this.createAccountButton.click();
        await this.waitForPageLoad();
    }

    private get usernameField() {
        return this.page.getByLabel('Username');
    }

    private get emailField() {
        return this.page.getByLabel('Email');
    }

    private get passwordField() {
        return this.page.getByLabel('Password', { exact: true });
    }

    private get confirmPasswordField() {
        return this.page.getByLabel('Confirm password');
    }

    private get firstName() {
        return this.page.getByLabel('First name');
    }

    private get lastName() {
        return this.page.getByLabel('Last name');
    }

    private get createAccountButton() {
        return this.page.getByText('create account');
    }

    async fillRegistrationForm(username: string, email: string, password: string, firstName: string, lastName: string): Promise<void> {
        await this.usernameField.fill(username);
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.confirmPasswordField.fill(password);
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.submitForm();
    }

    async submitForm(): Promise<void> {
        await this.createAccountButton.click();
    }

    async register(username: string, email: string, password: string, firstName: string, lastName: string): Promise<Response> {
        await this.fillRegistrationForm(username, email, password, firstName, lastName);
        await this.verifyLoggedIn(email);
    }


    async verifyLoggedIn(email: string): Promise<void> {
        await expect(this.page.getByText(email).first()).toBeVisible();
    }
}
