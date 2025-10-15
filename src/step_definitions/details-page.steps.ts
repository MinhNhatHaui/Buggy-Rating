import { When, Then, setDefaultTimeout, DataTable } from '@cucumber/cucumber';
import CustomWorld from '../support/world';

// Set timeout to 1 minute for longer operations
setDefaultTimeout(60 * 1000);

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