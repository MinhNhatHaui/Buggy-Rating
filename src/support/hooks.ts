import { Before, After, BeforeStep, AfterStep, ITestCaseHookParameter, ITestStepHookParameter, Status } from '@cucumber/cucumber';
import CustomWorld from './world';
import { mkdir } from 'fs/promises';

// Ensure screenshots directory exists
mkdir('./test-results/screenshots', { recursive: true }).catch(() => {});

Before(async function(this: CustomWorld) {
    await this.init();
});

BeforeStep(async function(this: CustomWorld) {
    if (this.page && !this.page.isClosed()) {
        await this.page.waitForLoadState('networkidle').catch(() => {});
    }
});

AfterStep(async function(this: CustomWorld, step: ITestStepHookParameter) {
    if (!this.page || this.page.isClosed()) return;

    try {
        const screenshot = await this.takeScreenshot();
        if (screenshot) {
            // Create base64 image data
            const base64Image = `data:image/png;base64,${screenshot.toString('base64')}`;
            await this.attach(base64Image, 'base64:image/png');

            // Save screenshot to file with a meaningful name
            if (step.result?.status === Status.FAILED) {
                const fs = require('fs').promises;
                const stepName = step.pickleStep?.text?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown_step';
                const timestamp = Date.now();
                const screenshotPath = `./test-results/screenshots/FAILED_${stepName}_${timestamp}.png`;
                await fs.writeFile(screenshotPath, screenshot);
                console.log(`❌ Screenshot saved for failed step: ${stepName}`);
            }
        }
    } catch (error: any) {
        if (!error.message?.includes('Browser closed')) {
            console.error('Failed to take step screenshot:', error);
        }
    }
});

After(async function(this: CustomWorld, scenario: ITestCaseHookParameter) {
    try {
        if (this.page && !this.page.isClosed()) {
            // Take screenshot for failed scenarios
            if (scenario.result?.status === Status.FAILED) {
                await this.page.waitForTimeout(1000); // Wait for error state
                const screenshot = await this.takeScreenshot();
                if (screenshot) {
                    // Save and attach the screenshot
                    const base64Image = `data:image/png;base64,${screenshot.toString('base64')}`;
                    await this.attach(base64Image, 'base64:image/png');

                    // Save to file with scenario name
                    const fs = require('fs').promises;
                    const timestamp = Date.now();
                    const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
                    const screenshotPath = `./test-results/screenshots/SCENARIO_FAILED_${scenarioName}_${timestamp}.png`;
                    await fs.writeFile(screenshotPath, screenshot);
                    console.log(`❌ Final state captured for failed scenario: ${scenario.pickle.name}`);
                }
            }
        }
    } catch (error: any) {
        if (!error.message?.includes('Browser closed')) {
            console.error('Failed to take scenario screenshot:', error);
        }
    } finally {
        // Always cleanup, but don't throw errors if browser is already closed
        try {
            await this.cleanup();
        } catch (error: any) {
            if (!error.message?.includes('Browser closed')) {
                console.error('Cleanup error:', error);
            }
        }
    }
});