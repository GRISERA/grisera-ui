import {BasePage} from './BasePage';

export class MeasurePage extends BasePage {
    async visit(): Promise<void> {
        await this.page.goto('/measures');
        await this.waitForPageLoad();
    }
}
