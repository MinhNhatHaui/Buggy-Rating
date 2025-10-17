import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { HeaderPage } from './HeaderPage';
import { BasePage } from './BasePage';
import { HomePage } from './HomePage';
import { ModelDetailsPage } from './ModelDetailsPage';

/**
 * PageObjectManager - Central place to manage all page objects
 * This makes it easy to access any page object from anywhere
 */
export class PageObjectManager {
    readonly page: Page;
    readonly basePage: BasePage;
    readonly loginPage: LoginPage;
    readonly headerPage: HeaderPage;
    readonly homePage: HomePage;
    readonly modelDetailsPage: ModelDetailsPage;

    constructor(page: Page) {
        this.page = page;
        this.basePage = new BasePage(page);
        this.loginPage = new LoginPage(page);
        this.headerPage = new HeaderPage(page);
        this.homePage = new HomePage(page);
        this.modelDetailsPage = new ModelDetailsPage(page);
    }

    /**
     * Get all page objects
     */
    getPages() {
        return {
            base: this.basePage,
            login: this.loginPage,
            header: this.headerPage,
            home: this.homePage,
            modelDetails: this.modelDetailsPage
        };
    }
}
