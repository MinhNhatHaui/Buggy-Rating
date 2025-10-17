import { Page, Locator } from '@playwright/test';
import { config } from '../config/environment';

export class LoginPage {
    readonly page: Page;
    
    // Selectors
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly profileLink: Locator;
    readonly logoutLink: Locator;
    readonly usernameDisplay: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initialize locators
        this.usernameInput = page.locator('input[name="login"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('button[type="submit"]');
        this.profileLink = page.locator('.nav-link >> text=Profile');
        this.logoutLink = page.locator('//a[text()="Logout"]');
        this.usernameDisplay = page.locator('[data-test="username"]');
    }

    /**
     * Navigate to the home page
     */
    async goto() {
        await this.page.goto(config.baseUrl);
    }

    /**
     * Login with credentials
     * @param username - Username to login with
     * @param password - Password to login with
     */
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    /**
     * Login with default credentials from environment
     */
    async loginWithDefaults() {
        const username = process.env.DEFAULT_USERNAME || '';
        const password = process.env.DEFAULT_PASSWORD || '';
        await this.login(username, password);
    }

    /**
     * Wait for successful login
     */
    async waitForLogin() {
        await this.profileLink.waitFor({ 
            state: 'visible', 
            timeout: config.timeouts.element 
        });
    }

    /**
     * Logout from the application
     */
    async logout() {
        await this.logoutLink.waitFor({ 
            state: 'visible', 
            timeout: config.timeouts.element 
        });
        await this.logoutLink.click();
    }

    /**
     * Check if user is logged in
     */
    async isLoggedIn(): Promise<boolean> {
        return await this.profileLink.isVisible();
    }

    /**
     * Get the displayed username
     */
    async getDisplayedUsername(): Promise<string> {
        return await this.usernameDisplay.textContent() || '';
    }
}
