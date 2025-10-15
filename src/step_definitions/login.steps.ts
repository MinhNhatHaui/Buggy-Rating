import { Given, When, Then } from '@cucumber/cucumber';
import CustomWorld from '../support/world';
import { config } from '../config/environment';

Given('I am logged in as {string} with password {string}', async function (this: CustomWorld, username: string, password: string) {
    // Navigate to the website
    await this.gotoHome();

    // Login
    await this.fill('input[name="login"]', username);
    await this.fill('input[name="password"]', password);
    await this.click('button[type="submit"]');

    // Verify login
    await this.waitForSelector('.nav-link >> text=Profile', { timeout: config.timeouts.element });
});

When('I logout', async function (this: CustomWorld) {
    await this.waitForTimeout(20000);
    
    try {
        // Wait for the logout link to be visible and ready
        await this.waitForSelector('//a[text()="Logout"]', { state: 'visible', timeout: config.timeouts.element });
        await this.waitForLoadState('networkidle', { timeout: config.timeouts.network }).catch(() => {});
        
        // Click the logout link
        const logoutLink = await this.$('//a[text()="Logout"]');
        if (!logoutLink) throw new Error('Logout link not found');
        
        await logoutLink.click();
        
        // Wait for navigation after logout
        await this.waitForLoadState('networkidle', { timeout: config.timeouts.network }).catch(() => {});
    } catch (error) {
        console.error('Logout failed:', error instanceof Error ? error.message : String(error));
        throw error;
    }
});