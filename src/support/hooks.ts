import { Before, After, BeforeStep, AfterStep, ITestCaseHookParameter, ITestStepHookParameter, Status } from '@cucumber/cucumber';
import CustomWorld from './world';
import { mkdir, readFile } from 'fs/promises';
import path from 'path';

// Constants
const SCREENSHOT_DIR = './test-results/screenshots';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const SCREENSHOT_TIMEOUT = 5000; // 5 seconds

// Ensure screenshots directory exists
mkdir(SCREENSHOT_DIR, { recursive: true }).catch(() => {});

async function takeScreenshot(world: CustomWorld, stepName: string): Promise<{success: boolean, fileName?: string}> {
    if (!world.page || world.page.isClosed()) {
        console.log('Page is not available for screenshot');
        return { success: false };
    }

    const timestamp = new Date().getTime();
    const sanitizedStep = stepName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 100);
    const fileName = `${sanitizedStep}_${timestamp}.png`;
    const filePath = path.join(SCREENSHOT_DIR, fileName);

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`Screenshot attempt ${attempt}/${MAX_RETRIES}`);
            await world.page.screenshot({
                path: filePath,
                timeout: SCREENSHOT_TIMEOUT,
                fullPage: false // Just capture viewport for reliability
            });
            console.log(`Screenshot successfully captured: ${filePath}`);
            return { success: true, fileName };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.log(`Attempt ${attempt} failed: ${errorMessage}`);
            if (attempt < MAX_RETRIES) {
                console.log(`Waiting ${RETRY_DELAY}ms before next attempt...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
        }
    }
    return { success: false };
}

Before(async function(this: CustomWorld, scenario: ITestCaseHookParameter) {
    this.scenarioName = scenario.pickle.name;
    await this.init();
    console.log(`Starting scenario: ${this.scenarioName}`);
});

BeforeStep(async function(this: CustomWorld) {
    if (this.page && !this.page.isClosed()) {
        // Ensure page is stable before each step
        await this.page.waitForLoadState('networkidle').catch(() => {});
    }
});

AfterStep(async function(this: CustomWorld, { result, pickle }: ITestStepHookParameter) {
    const stepName = (pickle as any).text || 'unknown_step';

    if (result.status === Status.FAILED) {
        console.log('Step failed, attempting to capture screenshot...');
        const screenshotResult = await takeScreenshot(this, stepName);
        if (screenshotResult.success && screenshotResult.fileName) {
            try {
                const screenshotPath = path.join(SCREENSHOT_DIR, screenshotResult.fileName);
                const buffer = await readFile(screenshotPath);
                await this.attach(buffer.toString('base64'), 'base64:image/png');
                console.log('Screenshot embedded in report');
            } catch (error) {
                console.error('Failed to attach screenshot to report:', error);
            }
        } else {
            console.error('Failed to capture screenshot after all attempts');
        }
    }
});

After(async function(this: CustomWorld, scenario: ITestCaseHookParameter) {
    try {
        if (scenario.result?.status === Status.FAILED) {
            // Take one final screenshot if scenario failed
            console.log('Taking final state screenshot...');
            const screenshotResult = await takeScreenshot(this, 'final_state');
            if (screenshotResult.success && screenshotResult.fileName) {
                try {
                    const screenshotPath = path.join(SCREENSHOT_DIR, screenshotResult.fileName);
                    const buffer = await readFile(screenshotPath);
                    await this.attach(buffer.toString('base64'), 'base64:image/png');
                    console.log('Final screenshot embedded in report');
                } catch (error) {
                    console.error('Failed to attach final screenshot to report:', error);
                }
            }
        }
    } catch (error) {
        console.error('Error taking final screenshot:', error);
    } finally {
        // Always cleanup
        try {
            await this.cleanup();
        } catch (error: any) {
            if (!error.message?.includes('Browser closed') && !error.message?.includes('Target closed')) {
                console.error('Cleanup error:', error);
            }
        }
    }
});
