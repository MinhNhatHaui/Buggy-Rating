import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import CustomWorld from '../support/world';
import { config } from '../config/environment';

// Set default timeout from config
setDefaultTimeout(config.timeouts.default);

Given('I am on the homepage', async function (this: CustomWorld) {
    const homePage = this.pages!.homePage;
    await homePage.gotoHomePage();
});

When('I navigate to a model of {string} from {string} as my choice', async function (this: CustomWorld, modelName: string, category: string) {
    const homePage = this.pages!.homePage;
    
    // Navigate to the model using the page object method
    await homePage.navigateToModel(modelName, category);
    
    // Store the model name for later verification
    this.data.selectedModel = modelName;
});

Then('I should be able to see the {string} model details page', async function (this: CustomWorld, modelName: string) {
    const modelDetailsPage = this.pages!.modelDetailsPage;
    
    // Wait for the model details page to load
    await modelDetailsPage.waitForPageLoad(modelName);
    
    // Verify we're on the correct model details page
    const isOnCorrectPage = await modelDetailsPage.isOnModelDetailsPage(modelName);
    expect(isOnCorrectPage).toBeTruthy();
    
    // Additional verifications
    const actualModelName = await modelDetailsPage.getModelName();
    expect(actualModelName.toLowerCase()).toContain(modelName.toLowerCase());
});

Then('I should be returned to the homepage', async function (this: CustomWorld) {
    const homePage = this.pages!.homePage;
    
    // Verify the login button is visible (indicating we're logged out)
    const isLoggedOut = await homePage.isLoggedOut();
    expect(isLoggedOut).toBeTruthy();
});