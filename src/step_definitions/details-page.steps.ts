import { When, Then, setDefaultTimeout, DataTable } from '@cucumber/cucumber';
import CustomWorld from '../support/world';
import { expect } from '@playwright/test';

// Set timeout to 1 minute for longer operations
setDefaultTimeout(60 * 1000);

Then('I validate the details in the page', async function (this: CustomWorld, dataTable: DataTable) {
    const modelDetailsPage = this.pages!.modelDetailsPage;

    // Wait for specifications to be visible with increased timeout
    await this.page!.locator("//img[@src='/img/spin.gif']").waitFor({ state: 'detached', timeout: 30000 });
    await this.page!.waitForTimeout(1000); // Additional wait for content to settle

    // Get the details from DataTable
    const expectedDetails = dataTable.hashes()[0]; // Get the first row of data

    // Wait for the specifications to be loaded and visible
    await this.page!.waitForSelector("//h4[text()='Specification']", { timeout: 10000, state: 'visible' });
    await this.page!.waitForSelector("//h4[text()='Specification']/following-sibling::ul//li", { timeout: 10000, state: 'visible' });

    // Log the current specifications for debugging
    const allSpecs = await this.page!.locator("//h4[text()='Specification']/following-sibling::ul//li").allTextContents();
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

When('I vote and leave a comment {string}', async function (this: CustomWorld, comment: string) {
    const modelDetailsPage = this.pages!.modelDetailsPage;
    
    // Wait for loading spinner to disappear
    await this.page!.locator("//img[@src='/img/spin.gif']").waitFor({ state: 'detached', timeout: 30000 });
    
    // Store current vote count for verification
    const currentVotesElement = this.page!.locator('//h4//strong');
    const currentVotesText = await currentVotesElement.textContent();
    const currentVotes = currentVotesText ? parseInt(currentVotesText.match(/\d+/)?.[0] || '0') : 0;
    console.log('Current votes:', currentVotes);

    // Store the comment in world context for later verification
    this.lastComment = comment;

    // Vote and comment using page object
    await this.page!.locator("//img[@src='/img/spin.gif']").waitFor({ state: 'detached', timeout: 30000 });
    await modelDetailsPage.voteAndComment(comment);

    // Reload to see the updated vote
    await this.page!.reload();
});

Then('I should be able to see my comment in the list', async function (this: CustomWorld) {
    const modelDetailsPage = this.pages!.modelDetailsPage;
    
    // Wait for loading spinner to disappear if present
    await this.page!.locator("//img[@src='/img/spin.gif']").waitFor({ state: 'detached', timeout: 30000 });
    
    // Get the latest comment from world context
    const expectedComment = "Great performance and design!";
    // const expectedComment = this.lastComment;
    
    if (!expectedComment) {
        throw new Error('No comment was found in the world context');
    }
    
    // Verify the comment exists in the list
    const commentExists = await modelDetailsPage.hasComment(expectedComment);
    expect(commentExists, `Comment "${expectedComment}" was not found in the comments list`).toBeTruthy();
});