import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

export default class CustomWorld extends World {
    private browser: Browser | undefined;
    private context: BrowserContext | undefined;
    public page: Page | undefined;
    private isClosing: boolean = false;
    public data: any = {};

    constructor(options: IWorldOptions) {
        super(options);
    }

    async init(): Promise<void> {
        if (this.isClosing) {
            await this.cleanup();
        }
        
        this.isClosing = false;
        
        // Disable Playwright debug output
        process.env.PWDEBUG = '0';
        process.env.DEBUG = '';
        
        this.browser = await chromium.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized', '--silent'],
            logger: {
                isEnabled: () => false,
                log: () => {}
            }
        });
        this.context = await this.browser.newContext({
            viewport: null // This allows the window to be maximized
        });
        this.page = await this.context.newPage();
        // Ensure the window is maximized
        await this.page.evaluate(() => {
            window.moveTo(0, 0);
            window.resizeTo(screen.width, screen.height);
        });
    }

    async takeScreenshot(): Promise<Buffer | undefined> {
        if (this.isClosing || !this.page || this.page.isClosed()) return undefined;

        try {
            // Wait for network operations to settle with a maximum wait time
            await Promise.race([
                this.page.waitForLoadState('networkidle'),
                new Promise(resolve => setTimeout(resolve, 3000))
            ]).catch(() => {});
            
            // Wait for any animations to complete with a short timeout
            try {
                await this.page.evaluate(() => 
                    new Promise(resolve => 
                        requestAnimationFrame(() => setTimeout(resolve, 100))
                    )
                );
            } catch (e) {} // Ignore animation waiting errors

            // Retry logic for taking screenshot
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    return await this.page.screenshot({ 
                        fullPage: true,
                        timeout: 5000,
                        animations: 'disabled'
                    });
                } catch (e: any) {
                    const screenshotError = e instanceof Error ? e : new Error(String(e));
                    if (attempt === 2) { // Last attempt
                        if (!screenshotError.message.toLowerCase().includes('browser closed')) {
                            console.error(`Screenshot attempt ${attempt + 1} failed:`, screenshotError.message);
                        }
                        return undefined;
                    }
                    await this.page.waitForTimeout(1000); // Wait before retry
                }
            }
        } catch (e: any) {
            const error = e instanceof Error ? e : new Error(String(e));
            // Only log unexpected errors
            if (!error.message.toLowerCase().includes('browser closed') && 
                !error.message.toLowerCase().includes('target closed')) {
                console.error('Screenshot failed:', error.message);
            }
            return undefined;
        }
    }

    async cleanup(): Promise<void> {
        if (this.isClosing) return;
        
        this.isClosing = true;
        try {
            // Take final screenshot if page is still available
            if (this.page && !this.page.isClosed()) {
                try {
                    const screenshot = await this.takeScreenshot();
                    if (screenshot) {
                        await this.attach(screenshot, 'image/png');
                    }
                } catch (error) {
                    console.error('Final screenshot failed:', error);
                }
            }

            // Close all resources in reverse order
            if (this.page) {
                await this.page.close().catch(() => {});
                this.page = undefined;
            }
            if (this.context) {
                await this.context.close().catch(() => {});
                this.context = undefined;
            }
            if (this.browser) {
                await this.browser.close().catch(() => {});
                this.browser = undefined;
            }
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }
}

setWorldConstructor(CustomWorld);