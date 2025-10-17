import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../config/environment';

export class ModelDetailsPage extends BasePage {
    // Selectors
    readonly modelName: Locator;
    readonly modelDescription: Locator;
    readonly modelImage: Locator;
    readonly voteButton: Locator;
    readonly commentInput: Locator;
    readonly commentButton: Locator;
    readonly commentsList: Locator;
    readonly overallRating: Locator;

    constructor(page: Page) {
        super(page);
        
        // Initialize locators
        this.modelName = page.locator('h2.text-center, h1');
        this.modelDescription = page.locator('.card-text, p.description');
        this.modelImage = page.locator('img[class*="img"]');
        this.voteButton = page.locator('button:has-text("Vote")');
        this.commentInput = page.locator('textarea[name="comment"], input[name="comment"]');
        this.commentButton = page.locator('button:has-text("Comment")');
        this.commentsList = page.locator('table tbody');
        this.overallRating = page.locator('text=/Overall Rating:/i');
    }

    /**
     * Get the current model name
     */
    async getModelName(): Promise<string> {
        await this.modelName.waitFor({ state: 'visible', timeout: config.timeouts.element });
        return await this.modelName.textContent() || '';
    }

    /**
     * Check if we're on the model details page
     * @param expectedModelName - Expected model name to verify
     */
    async isOnModelDetailsPage(expectedModelName: string): Promise<boolean> {
        try {
            const actualModelName = await this.getModelName();
            return actualModelName.toLowerCase().includes(expectedModelName.toLowerCase());
        } catch {
            return false;
        }
    }

    /**
     * Vote for the model
     * @param rating - Rating value (1-5 stars)
     */
    async vote(rating: number = 5) {
        // Click on the star rating (if available)
        const starSelector = `//input[@value='${rating}']`;
        const star = this.page.locator(starSelector);
        
        try {
            await star.waitFor({ state: 'visible', timeout: 5000 });
            await star.click();
        } catch {
            console.log('Star rating not available, using vote button');
        }
        
        // Click vote button
        if (await this.voteButton.isVisible()) {
            await this.voteButton.click();
        }
    }

    /**
     * Leave a comment on the model
     * @param comment - Comment text
     */
    async leaveComment(comment: string) {
        await this.commentInput.waitFor({ state: 'visible', timeout: config.timeouts.element });
        await this.commentInput.fill(comment);
        
        if (await this.commentButton.isVisible()) {
            await this.commentButton.click();
        }
    }

    /**
     * Vote and leave a comment
     * @param comment - Comment text
     * @param rating - Rating value (1-5 stars)
     */
    async voteAndComment(comment: string, rating: number = 5) {
        await this.vote(rating);
        await this.leaveComment(comment);
    }

    /**
     * Check if a specific comment exists
     * @param commentText - Comment text to search for
     */
    async hasComment(commentText: string): Promise<boolean> {
        const comments = await this.commentsList.all();
        
        for (const comment of comments) {
            const text = await comment.textContent();
            if (text && text.includes(commentText)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get model description
     */
    async getDescription(): Promise<string> {
        return await this.modelDescription.textContent() || '';
    }

    /**
     * Get overall rating
     */
    async getOverallRating(): Promise<string> {
        return await this.overallRating.textContent() || '';
    }

    /**
     * Check if model image is visible
     */
    async hasImage(): Promise<boolean> {
        return await this.modelImage.isVisible();
    }

    /**
     * Wait for model details page to load
     * @param modelName - Expected model name
     */
    async waitForPageLoad(modelName?: string) {
        await this.modelName.waitFor({ state: 'visible', timeout: config.timeouts.element });
        
        if (modelName) {
            const actualName = await this.getModelName();
            if (!actualName.toLowerCase().includes(modelName.toLowerCase())) {
                throw new Error(`Expected model "${modelName}" but got "${actualName}"`);
            }
        }
    }
}
