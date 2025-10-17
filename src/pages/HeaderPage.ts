import { Page, Locator } from '@playwright/test';
import { config } from '../config/environment';

export class HeaderPage {
    readonly page: Page;
    
    // Selectors
    readonly profileLink: Locator;
    readonly logoutLink: Locator;
    readonly homeLink: Locator;
    readonly registerLink: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initialize locators
        this.profileLink = page.locator('.nav-link >> text=Profile');
        this.logoutLink = page.locator('//a[text()="Logout"]');
        this.homeLink = page.locator('a[href="/"]');
        this.registerLink = page.locator('a[href="/register"]');
    }

    /**
     * Check if Profile menu is visible
     */
    async isProfileVisible(): Promise<boolean> {
        return await this.profileLink.isVisible();
    }

    /**
     * Click on Profile link
     */
    async clickProfile() {
        await this.profileLink.click();
    }

    /**
     * Click on Logout link
     */
    async clickLogout() {
        await this.logoutLink.waitFor({ 
            state: 'visible', 
            timeout: config.timeouts.element 
        });
        await this.logoutLink.click();
    }

    /**
     * Go to home page
     */
    async goHome() {
        await this.homeLink.click();
    }

    /**
     * Check if user is logged in
     */
    async isUserLoggedIn(): Promise<boolean> {
        return await this.profileLink.isVisible() && await this.logoutLink.isVisible();
    }
}
