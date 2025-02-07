import {BasePage} from "./BasePage";

export class ParticipantsTab extends BasePage{
    async visit(): Promise<void> {
        await this.page.getByRole('tab', { name: 'Participants' }).click();
        // await  this.page.getByRole('tab', { name: 'Participants' }).click();
    }

    async addParticipant(participantName: string): Promise<void> {
        await this.page.getByRole('button', { name: 'Add' }).click();
        await this.page.getByLabel('Participant').click();
        await this.page.locator('div[role="option"]:has-text("Anderson James")').first().click();
        await this.page.getByRole('dialog').getByRole('button', { name: 'Add' }).click();
    }
}
