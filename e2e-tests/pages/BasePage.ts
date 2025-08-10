import { Page } from '@playwright/test';

export abstract class BasePage {
    protected page: Page;

    protected constructor(page: Page) {
        this.page = page;
    }

    abstract visit(): Promise<void>;

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }
}
