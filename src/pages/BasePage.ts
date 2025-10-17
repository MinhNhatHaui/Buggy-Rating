import { Page, Locator } from '@playwright/test';
import { config } from '../config/environment';

/**
 * BasePage - Common functionality for all page objects
 */
export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a specific URL
     * @param url - URL to navigate to
     */
    async goto(url: string) {
        const fullUrl = url.startsWith('http') ? url : `${config.baseUrl}${url}`;
        await this.page.goto(fullUrl);
    }

    /**
     * Navigate to home page
     */
    async gotoHome() {
        await this.goto('/');
    }

    /**
     * Wait for page to load
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle', { 
            timeout: config.timeouts.network 
        });
    }

    /**
     * Get page title
     */
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * Get current URL
     */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /**
     * Take a screenshot
     */
    async takeScreenshot(): Promise<Buffer> {
        return await this.page.screenshot({ 
            fullPage: true 
        });
    }

    /**
     * Wait for a specific time
     * @param ms - Milliseconds to wait
     */
    async wait(ms: number) {
        await this.page.waitForTimeout(ms);
    }

    /**
     * Check if element is visible
     * @param selector - Element selector
     */
    async isVisible(selector: string): Promise<boolean> {
        return await this.page.locator(selector).isVisible();
    }

    /**
     * Get element text
     * @param selector - Element selector
     */
    async getText(selector: string): Promise<string> {
        return await this.page.locator(selector).textContent() || '';
    }
}
