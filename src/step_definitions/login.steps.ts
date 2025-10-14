import { Given, When, Then, setDefaultTimeout, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import CustomWorld from '../support/world';

// Set timeout to 1 minute for longer operations
setDefaultTimeout(60 * 1000);

Given('I am logged in as {string} with password {string}', async function (this: CustomWorld, username: string, password: string) {
    // Navigate to the website
    await this.page?.goto('https://buggy.justtestit.org/');

    // Login
    await this.page?.fill('input[name="login"]', username);
    await this.page?.fill('input[name="password"]', password);
    await this.page?.click('button[type="submit"]');

    // Verify login
    await this.page?.waitForSelector('.nav-link >> text=Profile', { timeout: 10000 });
});

Then('I validate the details in the page', async function (this: CustomWorld, dataTable: DataTable) {
    if (!this.page) throw new Error('Page is not initialized');

    // Wait for specifications to be visible with increased timeout
    await this.page.locator("//img[@src='/img/spin.gif']").waitFor({ state: 'detached', timeout: 30000 });
    await this.page.waitForTimeout(1000); // Additional wait for content to settle

    // Get the details from DataTable
    const expectedDetails = dataTable.hashes()[0]; // Get the first row of data

    // Wait for the specifications to be loaded and visible
    await this.page.waitForSelector("//h4[text()='Specification']", { timeout: 10000, state: 'visible' });
    await this.page.waitForSelector("//h4[text()='Specification']/following-sibling::ul//li", { timeout: 10000, state: 'visible' });

    // Log the current specifications for debugging
    const allSpecs = await this.page.locator("//h4[text()='Specification']/following-sibling::ul//li").allTextContents();
    console.log('Found specifications:', allSpecs);

    // Validate each detail from the DataTable
    for (const [key, value] of Object.entries(expectedDetails)) {
        const matcher = new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const matchingSpec = allSpecs.find(spec => matcher.test(spec));

        if (!matchingSpec) {
            // Create a detailed error message with visual formatting
            const errorMessage = [
                '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                `❌ Specification Mismatch for "${key}"`,
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                '',
                `Expected Value: "${value}"`,
                '',
                'Actual Specifications Found:',
                ...allSpecs.map(spec => `  ▸ ${spec.trim()}`),
                '',
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
            ].join('\n');

            throw new Error(errorMessage);
        }

        console.log(`✓ ${key}: Expected "${value}" - Found "${matchingSpec}"`);
    }
});

When('I navigate to a model of {string} from {string} as my choice', async function (this: CustomWorld, modelName: string, category: string) {
    if (!this.page) throw new Error('Page is not initialized');
    const iconSelector = `//h2[text()='${category}']/following-sibling::a//img`
    await this.page.waitForSelector(iconSelector, { timeout: 10000 });
    await this.page.click(iconSelector);

    await this.page.waitForSelector(`//a[text()='${modelName}']`, { timeout: 10000 });
    await this.page.click(`//a[text()='${modelName}']`);
});

When('I vote and leave a comment {string}', async function (this: CustomWorld, comment: string) {
    if (!this.page) throw new Error('Page is not initialized');
    // Store current vote count for verification
    await this.page.locator("//img[@src='/img/spin.gif']").waitFor({ state: 'detached', timeout: 30000 });
    const currentVotesElement = this.page.locator('//h4//strong');
    const currentVotesText = await currentVotesElement.textContent();
    const currentVotes = currentVotesText ? parseInt(currentVotesText.match(/\d+/)?.[0] || '0') : 0;
    console.log('Current votes:', currentVotes);

    await this.page.locator("//img[@src='/img/spin.gif']").waitFor({ state: 'detached', timeout: 30000 });
    await this.page.fill("textarea#comment", comment, {timeout: 30000});

    // Click the comment button
    await this.page.click("//button[text()='Vote!']");
    await this.page.reload();

});

When('I logout', async function (this: CustomWorld) {
    if (!this.page) throw new Error('Page is not initialized');
    await this.page.waitForTimeout(20000);
    
    try {
        // Wait for the logout link to be visible and ready
        await this.page.waitForSelector('//a[text()="Logout"]', { state: 'visible', timeout: 10000 });
        await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        
        // Click the logout link
        const logoutLink = await this.page.$('//a[text()="Logout"]');
        if (!logoutLink) throw new Error('Logout link not found');
        
        await logoutLink.click();
        
        // Wait for navigation after logout
        await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    } catch (error) {
        console.error('Logout failed:', error instanceof Error ? error.message : String(error));
        throw error;
    }
});

Then('I should be returned to the homepage', async function (this: CustomWorld) {
    if (!this.page) throw new Error('Page is not initialized');

    // Verify the login button is visible (indicating we're logged out)
    const loginButton = await this.page.isVisible('button[type="submit"]');
    expect(loginButton).toBeTruthy();
});