# Page Object Model (POM) Design Pattern

## 📚 Overview
This project follows the **Page Object Model (POM)** design pattern to maintain clean, reusable, and maintainable test code.

## 🏗️ Structure

```
src/
├── pages/                      # Page Object Models
│   ├── BasePage.ts            # Base class with common methods
│   ├── LoginPage.ts           # Login page selectors & methods
│   ├── HeaderPage.ts          # Header/navigation selectors & methods
│   └── PageObjectManager.ts   # Central manager for all pages
├── step_definitions/          # Cucumber step definitions
│   ├── login.steps.ts         # Login-related steps
│   └── common/
│       ├── header.steps.ts    # Header-related steps
│       └── login.steps.ts     # Common login steps
└── support/
    └── world.ts               # CustomWorld with PageObjectManager
```

## 🎯 Benefits

### 1. **Maintainability**
- Selectors are in one place
- Change a selector once, update everywhere
- Easy to update when UI changes

### 2. **Reusability**
- Page objects can be used across multiple tests
- Common actions defined once
- Shared across step definitions

### 3. **Readability**
- Step definitions are clean and business-focused
- Technical details hidden in page objects
- Clear separation of concerns

### 4. **Testability**
- Easy to mock page objects for unit testing
- Better error messages
- Easier debugging

## 📝 How to Use

### Creating a New Page Object

```typescript
import { Page, Locator } from '@playwright/test';
import { config } from '../config/environment';

export class MyNewPage {
    readonly page: Page;
    
    // Define selectors as readonly properties
    readonly myButton: Locator;
    readonly myInput: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initialize locators in constructor
        this.myButton = page.locator('#my-button');
        this.myInput = page.locator('input[name="my-input"]');
    }

    /**
     * Add descriptive methods for actions
     */
    async clickMyButton() {
        await this.myButton.click();
    }

    async fillMyInput(text: string) {
        await this.myInput.fill(text);
    }
}
```

### Adding to PageObjectManager

```typescript
import { MyNewPage } from './MyNewPage';

export class PageObjectManager {
    readonly myNewPage: MyNewPage;

    constructor(page: Page) {
        this.page = page;
        // ... existing pages
        this.myNewPage = new MyNewPage(page);
    }
}
```

### Using in Step Definitions

```typescript
import { Given } from '@cucumber/cucumber';
import CustomWorld from '../support/world';

Given('I perform an action', async function (this: CustomWorld) {
    const myPage = this.pages!.myNewPage;
    await myPage.clickMyButton();
    await myPage.fillMyInput('test data');
});
```

## 🔍 Examples

### Before POM (❌ BAD)

```typescript
Given('I am logged in', async function (this: CustomWorld) {
    await this.gotoHome();
    await this.fill('input[name="login"]', username);
    await this.fill('input[name="password"]', password);
    await this.click('button[type="submit"]');
    await this.waitForSelector('.nav-link >> text=Profile');
});
```

**Problems:**
- Selectors hardcoded in step definition
- Duplicated across multiple files
- Hard to maintain when UI changes
- Mixes technical details with business logic

### After POM (✅ GOOD)

```typescript
Given('I am logged in', async function (this: CustomWorld) {
    const loginPage = this.pages!.loginPage;
    await loginPage.goto();
    await loginPage.loginWithDefaults();
    await loginPage.waitForLogin();
});
```

**Benefits:**
- Clean and readable
- Selectors in LoginPage
- Easy to maintain
- Business-focused

## 📋 Best Practices

### 1. **One Page Object per Page/Component**
```
LoginPage.ts     → Login functionality
HeaderPage.ts    → Header/navigation
HomePage.ts      → Home page features
```

### 2. **Use Descriptive Method Names**
```typescript
// ✅ GOOD
async loginWithDefaults()
async waitForLogin()
async isUserLoggedIn()

// ❌ BAD
async doLogin()
async wait()
async check()
```

### 3. **Keep Selectors as Properties**
```typescript
// ✅ GOOD - Reusable and maintainable
readonly loginButton: Locator;

constructor(page: Page) {
    this.loginButton = page.locator('button[type="submit"]');
}

async clickLogin() {
    await this.loginButton.click();
}

// ❌ BAD - Hardcoded selector
async clickLogin() {
    await this.page.locator('button[type="submit"]').click();
}
```

### 4. **Add JSDoc Comments**
```typescript
/**
 * Login with credentials
 * @param username - Username to login with
 * @param password - Password to login with
 */
async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
}
```

### 5. **Return Promises for Chaining**
```typescript
// Allows: await page.goto().login().verify()
async goto() {
    await this.page.goto(config.baseUrl);
    return this;
}
```

## 🚀 Quick Reference

### Accessing Page Objects

```typescript
// In any step definition
Given('some step', async function (this: CustomWorld) {
    // Access via PageObjectManager
    const loginPage = this.pages!.loginPage;
    const headerPage = this.pages!.headerPage;
    
    // Use page object methods
    await loginPage.login('user', 'pass');
    await headerPage.clickProfile();
});
```

### Common Patterns

```typescript
// Navigation
await loginPage.goto();

// Filling forms
await loginPage.login(username, password);

// Verification
const isLoggedIn = await loginPage.isLoggedIn();
expect(isLoggedIn).toBe(true);

// Or using Playwright assertions
await expect(loginPage.profileLink).toBeVisible();
```

## 📖 Further Reading

- [Page Object Pattern - Martin Fowler](https://martinfowler.com/bliki/PageObject.html)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Cucumber Best Practices](https://cucumber.io/docs/guides/overview/)
