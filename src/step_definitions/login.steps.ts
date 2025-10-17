import { Given, When, Then } from '@cucumber/cucumber';
import CustomWorld from '../support/world';
import { expect } from '@playwright/test';
import { config } from '../config/environment';

// Step for logging in with default credentials from environment
Given('I am logged in with default credentials', async function (this: CustomWorld) {
    const loginPage = this.pages!.loginPage;
    
    // Navigate to the website and login
    await loginPage.goto();
    await loginPage.loginWithDefaults();
    await loginPage.waitForLogin();
});

// Step for logging in with specific credentials (still available if needed)
Given('I am logged in as {string} with password {string}', async function (this: CustomWorld, username: string, password: string) {
    const loginPage = this.pages!.loginPage;
    
    // Navigate to the website and login
    await loginPage.goto();
    await loginPage.login(username, password);
    await loginPage.waitForLogin();
});

Then('I should see Profile menu on the header', async function (this: CustomWorld) {
    const headerPage = this.pages!.headerPage;
    await expect(headerPage.profileLink).toBeVisible();
});

Then('I should see my username {string} displayed on the homepage', async function (this: CustomWorld, username: string) {
    const loginPage = this.pages!.loginPage;
    await expect(loginPage.usernameDisplay).toHaveText(username);
});