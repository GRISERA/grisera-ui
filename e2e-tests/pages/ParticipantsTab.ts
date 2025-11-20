import { BasePage } from './BasePage';

export class ParticipantsTab extends BasePage {
    async visit(): Promise<void> {
        await this.page.getByRole('tab', { name: 'Participants' }).click();
    }

    async addParticipant(participantName: string): Promise<void> {
        await this.page.getByTestId('experiment-participant-add-button').click();
        await this.page.getByLabel('Participant').click();
        await this.page.locator(`div[role="option"]:has-text("${ participantName }")`).first().click();
        await this.page.getByRole('dialog').getByRole('button', { name: 'Assign to experiment' }).click();
    }
}
