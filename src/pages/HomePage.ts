import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../config/environment';

export class HomePage extends BasePage {
    // Selectors
    readonly popularMakeSection: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);
        
        // Initialize locators
        this.popularMakeSection = page.locator('//h2[text()="Popular Make"]');
        this.loginButton = page.locator('button[type="submit"]');
    }

    /**
     * Navigate to homepage
     */
    async gotoHomePage() {
        await super.gotoHome();
    }

    /**
     * Check if we're on the homepage
     */
    async isOnHomepage(): Promise<boolean> {
        return await this.popularMakeSection.isVisible();
    }

    /**
     * Get category icon locator
     * @param category - Category name (e.g., "Popular Make", "All Makes")
     */
    getCategoryIcon(category: string): Locator {
        return this.page.locator(`//h2[text()='${category}']/following-sibling::a//img`);
    }

    /**
     * Get model link locator
     * @param modelName - Model name (e.g., "Diablo", "Murciélago")
     */
    getModelLink(modelName: string): Locator {
        return this.page.locator(`//a[text()='${modelName}']`);
    }

    /**
     * Click on a category icon
     * @param category - Category name
     */
    async clickCategory(category: string) {
        const icon = this.getCategoryIcon(category);
        await icon.waitFor({ state: 'visible', timeout: config.timeouts.element });
        await icon.click();
    }

    /**
     * Navigate to a specific model from a category
     * @param modelName - Model name to navigate to
     * @param category - Category to select from
     */
    async navigateToModel(modelName: string, category: string) {
        // Click on the category icon
        await this.clickCategory(category);

        // Wait for and click on the model link
        const modelLink = this.getModelLink(modelName);
        await modelLink.waitFor({ state: 'visible', timeout: config.timeouts.element });
        await modelLink.click();
    }

    /**
     * Check if login button is visible (user is logged out)
     */
    async isLoggedOut(): Promise<boolean> {
        return await this.loginButton.isVisible();
    }

    /**
     * Get all available models in a category
     * @param category - Category name
     */
    async getModelsInCategory(category: string): Promise<string[]> {
        await this.clickCategory(category);
        
        // Get all model links
        const modelLinks = await this.page.locator('//a[contains(@href, "/model/")]').all();
        const models: string[] = [];
        
        for (const link of modelLinks) {
            const text = await link.textContent();
            if (text) models.push(text.trim());
        }
        
        return models;
    }
}
