import {BasePage} from './BasePage';

export class SettingsPage extends BasePage {
    async visit(): Promise<void> {
        await this.page.goto('/settings');
        await this.waitForPageLoad();
    }
}
