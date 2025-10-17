import { setDefaultTimeout, When } from "@cucumber/cucumber";
import CustomWorld from "../support/world";
import { config } from "../config/environment";
setDefaultTimeout(config.timeouts.default);

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