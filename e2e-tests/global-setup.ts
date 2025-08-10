import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import path from 'path';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    // Use the baseURL from config
    baseURL: config.projects[0].use.baseURL || 'http://localhost:8080'
  });
  const page = await context.newPage();
  
  try {
    console.log('Setting up global authentication...');
    
    // Login as default user
    const loginPage = new LoginPage(page);
    await loginPage.loggedInAsDefaultUser();
    
    // Save authentication state to file
    await context.storageState({ path: path.join(__dirname, 'auth-state.json') });
    
    console.log('Global authentication setup completed successfully');
  } catch (error) {
    console.error('Global authentication setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;