import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class FilesPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // Page navigation
    async visit(): Promise<void> {
        await this.page.goto('/files');
        await this.waitForPageLoad();
    }

    // Main elements getters
    private get uploadButton() {
        return this.page.getByTestId('upload-file-button');
    }

    private get filesTable() {
        return this.page.getByTestId('files-table');
    }

    // Upload dialog elements
    private get uploadDialog() {
        return this.page.getByTestId('upload-dialog');
    }

    private get uploadDialogCard() {
        return this.uploadDialog.locator('.v-card');
    }

    private get fileNameInput() {
        return this.page.getByTestId('file-name-input');
    }

    private get fileInput() {
        return this.page.getByTestId('file-input');
    }

    private get fileInputContainer() {
        return this.page.locator('.file-input-test');
    }

    private get uploadSubmitButton() {
        return this.page.getByTestId('upload-submit-button');
    }

    private get uploadCancelButton() {
        return this.page.getByTestId('upload-cancel-button');
    }

    // File action buttons
    private get previewButtons() {
        return this.page.getByTestId('preview-file-button');
    }

    private get downloadButtons() {
        return this.page.getByTestId('download-file-button');
    }

    private get deleteButtons() {
        return this.page.getByTestId('delete-file-button');
    }

    // Delete confirmation dialog
    private get deleteConfirmDialog() {
        return this.page.getByTestId('delete-confirm-dialog');
    }

    private get deleteSubmitButton() {
        return this.page.getByTestId('delete-submit-button');
    }

    private get deleteCancelButton() {
        return this.page.getByTestId('delete-cancel-button');
    }

    // Actions
    async openUploadDialog(): Promise<void> {
        // Make sure button is visible and enabled
        await this.uploadButton.waitFor({ state: 'visible' });
        await this.uploadButton.click();
        
        // Wait for dialog card to be visible using CSS selector
        await this.page.waitForSelector('.v-dialog .v-card', { 
            state: 'visible',
            timeout: 10000 
        });
        
        // Wait a bit for Vue animations to complete
        await this.page.waitForTimeout(1000);
    }

    async closeUploadDialog(): Promise<void> {
        await this.uploadCancelButton.click();
        await this.uploadDialogCard.waitFor({ state: 'hidden' });
    }

    async fillUploadForm(fileName: string, filePath: string): Promise<void> {
        await this.fileNameInput.fill(fileName);
        // Use the actual input element for file upload
        await this.fileInput.setInputFiles(filePath);
    }

    async submitUpload(): Promise<void> {
        await this.uploadSubmitButton.click();
        // Wait for dialog to close after successful upload
        await this.uploadDialogCard.waitFor({ state: 'hidden' });
    }

    async uploadFile(fileName: string, filePath: string): Promise<void> {
        await this.openUploadDialog();
        await this.fillUploadForm(fileName, filePath);
        await this.submitUpload();
    }

    async getFileRowByName(fileName: string) {
        return this.filesTable.locator('tr').filter({ hasText: fileName });
    }

    async isFileVisible(fileName: string): Promise<boolean> {
        try {
            const fileRow = await this.getFileRowByName(fileName);
            return await fileRow.isVisible();
        } catch {
            return false;
        }
    }

    async previewFile(fileName: string): Promise<void> {
        const fileRow = await this.getFileRowByName(fileName);
        await fileRow.getByTestId('preview-file-button').click();
    }

    async downloadFile(fileName: string): Promise<void> {
        const fileRow = await this.getFileRowByName(fileName);
        await fileRow.getByTestId('download-file-button').click();
    }

    async openDeleteFileDialog(fileName: string): Promise<void> {
        const fileRow = await this.getFileRowByName(fileName);
        const deleteButton = fileRow.getByTestId('delete-file-button');
        
        // Wait for delete button to be visible and enabled
        await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
        
        await deleteButton.click();
        
        // Wait for dialog with shorter timeout and try alternative selector
        try {
            await this.deleteConfirmDialog.waitFor({ state: 'visible', timeout: 3000 });
        } catch (e) {
            // Try alternative selector - get first visible dialog
            const dialog = this.page.locator('.v-dialog .v-card').first();
            await dialog.waitFor({ state: 'visible', timeout: 3000 });
        }
    }

    async confirmDeleteFile(): Promise<void> {
        try {
            await this.deleteSubmitButton.click();
        } catch (e) {
            // Try alternative selector for delete button
            await this.page.locator('button:has-text("Delete"), button:has-text("Confirm"), .v-btn:has-text("Delete")').first().click();
        }
        
        // Wait for dialog to close
        await this.page.waitForTimeout(1000);
    }

    async cancelDeleteFile(): Promise<void> {
        try {
            await this.deleteCancelButton.click();
        } catch (e) {
            // Try alternative selector for cancel button
            await this.page.locator('button:has-text("Cancel"), .v-btn:has-text("Cancel")').first().click();
        }
        
        // Wait for dialog to close
        await this.page.waitForTimeout(1000);
    }

    async deleteFile(fileName: string): Promise<void> {
        await this.openDeleteFileDialog(fileName);
        await this.confirmDeleteFile();
    }

    async getFilesCount(): Promise<number> {
        // Count table rows excluding the header
        const rows = this.filesTable.locator('tbody tr');
        return await rows.count();
    }

    async waitForFilesTableLoad(): Promise<void> {
        await this.filesTable.waitFor({ state: 'visible' });
        // Wait for loading state to finish
        await this.page.waitForTimeout(1000);
    }

    // Form validation helpers
    async hasFileNameValidationError(): Promise<boolean> {
        const errorMessage = this.page.locator('.v-messages__message').filter({ hasText: 'File name is required' });
        return await errorMessage.isVisible();
    }

    async hasFileSelectionValidationError(): Promise<boolean> {
        const errorMessage = this.page.locator('.v-messages__message').filter({ hasText: 'File is required' });
        return await errorMessage.isVisible();
    }

    async isUploadButtonDisabled(): Promise<boolean> {
        return await this.uploadSubmitButton.isDisabled();
    }

    async isUploadDialogPersistent(): Promise<boolean> {
        // Try to click outside the dialog
        await this.page.click('body', { position: { x: 10, y: 10 } });
        await this.page.waitForTimeout(500);
        // Dialog should still be visible if it's persistent
        return await this.page.locator('.v-dialog .v-card').isVisible();
    }

    async cleanupTestFiles(testFileNames: string[]): Promise<void> {
        console.log(`Starting cleanup of ${testFileNames.length} test files`);
        
        await this.visit();
        await this.waitForFilesTableLoad();
        
        let cleanedCount = 0;
        
        for (const fileName of testFileNames) {
            try {
                const isVisible = await this.isFileVisible(fileName);
                
                if (isVisible) {
                    console.log(`Deleting test file: ${fileName}`);
                    
                    // Try to delete the file through UI
                    try {
                        await this.deleteFile(fileName);
                        cleanedCount++;
                        console.log(`Successfully deleted: ${fileName}`);
                    } catch (deleteError) {
                        console.warn(`Failed to delete ${fileName}:`, deleteError);
                    }
                    
                    // Small delay between deletions
                    await this.page.waitForTimeout(500);
                } else {
                    console.log(`Test file not found (already deleted?): ${fileName}`);
                }
            } catch (error) {
                console.warn(`Failed to delete test file ${fileName}:`, error);
                // Continue with other files even if one fails
            }
        }
        
        console.log(`Cleanup completed: ${cleanedCount} files deleted`);
        
        // Refresh page to ensure clean state for next test
        await this.page.reload();
        await this.waitForFilesTableLoad();
    }

    async cleanupAllTestFiles(): Promise<void> {
        console.log('Starting cleanup of all test files');
        
        await this.visit();
        await this.waitForFilesTableLoad();
        
        // Get all files in table and filter test files by common patterns
        const testPatterns = [
            'Test Document', 'Test Image', 'Action Test File', 'Delete Test File', 
            'Delete Success Test', 'Multi File', 'Persistence Test', 'Debug Upload'
        ];
        
        const allFileNames = await this.page.evaluate(() => {
            const table = document.querySelector('[data-testid="files-table"]');
            if (!table) return [];
            const rows = table.querySelectorAll('tbody tr');
            return Array.from(rows).map(row => {
                const cells = row.querySelectorAll('td');
                return cells[0]?.textContent?.trim() || ''; // First column should be file name
            }).filter(name => name.length > 0);
        });
        
        console.log(`Found ${allFileNames.length} files in table`);
        
        const testFilesToDelete = allFileNames.filter(fileName => 
            testPatterns.some(pattern => fileName.includes(pattern))
        );
        
        console.log(`Found ${testFilesToDelete.length} test files to delete`);
        
        if (testFilesToDelete.length > 0) {
            await this.cleanupTestFiles(testFilesToDelete);
        }
    }
}