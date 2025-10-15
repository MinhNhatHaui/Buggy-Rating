import { Given, When, Then, setDefaultTimeout, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import CustomWorld from '../support/world';
import { config } from '../config/environment';

// Set default timeout from config
setDefaultTimeout(config.timeouts.default);

When('I navigate to a model of {string} from {string} as my choice', async function (this: CustomWorld, modelName: string, category: string) {
    const iconSelector = `//h2[text()='${category}']/following-sibling::a//img`
    await this.waitForSelector(iconSelector, { timeout: config.timeouts.element });
    await this.click(iconSelector);

    await this.waitForSelector(`//a[text()='${modelName}']`, { timeout: config.timeouts.element });
    await this.click(`//a[text()='${modelName}']`);
});

Then('I should be returned to the homepage', async function (this: CustomWorld) {
    // Verify the login button is visible (indicating we're logged out)
    const loginButton = await this.isVisible('button[type="submit"]');
    expect(loginButton).toBeTruthy();
});