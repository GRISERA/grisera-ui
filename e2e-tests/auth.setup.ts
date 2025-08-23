import { test as setup, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import path from 'path';

const authFile = path.join(__dirname, 'auth-state.json');

setup('authenticate', async ({ page }) => {
  console.log('Setting up authentication for test project...');
  
  const loginPage = new LoginPage(page);
  await loginPage.loggedInAsDefaultUser();
  
  // Verify authentication was successful
  await expect(page.getByText('test@example.com')).toBeVisible();
  
  // Save signed-in state to file
  await page.context().storageState({ path: authFile });
  
  console.log('Authentication setup completed successfully');
});