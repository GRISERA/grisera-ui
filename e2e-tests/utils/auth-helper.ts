import { Page } from '@playwright/test';
import { DatasetListPage } from '../pages/DatasetListPage';

export class AuthHelper {
    constructor(private page: Page) {}

    /**
     * Ensures user is properly authenticated and has access to datasets
     * This should be called in test setup when authentication state is needed
     */
    async ensureAuthenticated(): Promise<void> {
        // With global setup, authentication state should already be loaded
        // This method can be used for additional verification if needed
        await this.page.goto('/');
        
        // Wait for the page to load and verify we're not on login page
        await this.page.waitForLoadState('networkidle');
        
        // If we're redirected to login, the auth state might have expired
        if (this.page.url().includes('/login')) {
            throw new Error('Authentication state expired or invalid. Please check global setup.');
        }
    }

    /**
     * Ensures user is authenticated and selects a dataset for file operations
     */
    async ensureAuthenticatedWithDataset(): Promise<DatasetListPage> {
        await this.ensureAuthenticated();
        
        const datasetListPage = new DatasetListPage(this.page);
        await datasetListPage.usingAnyDataset();
        
        return datasetListPage;
    }
}