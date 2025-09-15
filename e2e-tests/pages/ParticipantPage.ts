import { BasePage } from './BasePage';

export class ParticipantPage extends BasePage {
    async visit(): Promise<void> {
        await this.page.goto('/participants');
        await this.waitForPageLoad();
    }
}
