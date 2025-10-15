# Buggy Rating E2E Testing

![Playwright](https://img.shields.io/badge/Playwright-2EAD33.svg?style=for-the-badge&logo=Playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white)
![Cucumber](https://img.shields.io/badge/Cucumber-23D96C.svg?style=for-the-badge&logo=Cucumber&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=for-the-badge&logo=GitHub-Actions&logoColor=white)

End-to-end testing suite for the Buggy Rating application using Playwright, Cucumber.js, and TypeScript.

## 🚀 Features

- BDD testing with Cucumber.js
- Cross-browser testing with Playwright
- TypeScript support
- Page Object Model implementation
- Environment-based configuration
- GitHub Actions CI/CD integration
- Parallel test execution
- HTML and JSON reporting
- Screenshot and video capture
- Scheduled test runs

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm (included with Node.js)
- Git
- Visual Studio Code (recommended)

## 🛠️ Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/MinhNhatHaui/Buggy-Rating.git
cd Buggy-Rating
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Install Playwright browsers:
\`\`\`bash
npx playwright install chromium
\`\`\`

## 🔧 Configuration

### Environment Setup

1. Copy the example environment file:
\`\`\`bash
cp env/.env.example env/.env
\`\`\`

2. Update environment variables in \`env/.env\` as needed.

Available environments:
- staging1 (default)
- sit1
- uat1

### Test Configuration

Configure test settings in:
- \`cucumber.mjs\` - Cucumber configuration
- \`playwright.config.ts\` - Playwright configuration
- \`src/config/environment.ts\` - Environment configuration

## 🏃‍♂️ Running Tests

### Running All Tests
\`\`\`bash
npm run test:bdd
\`\`\`

### Running Specific Test Tags
\`\`\`bash
npm run test:bdd:tags "@smoke"
npm run test:bdd:logout
\`\`\`

### Running Tests in UI Mode
\`\`\`bash
npm run test:bdd:ui
\`\`\`

## 📊 Test Reports

After test execution, reports are generated in:
- HTML Report: \`test-results/cucumber-report.html\`
- JSON Report: \`cucumber-report.json\`
- Screenshots: \`test-results/screenshots\`

## 🔄 Continuous Integration

GitHub Actions workflows are configured for:
- Push to main branch
- Pull requests
- Scheduled runs
- Manual triggers

### Workflow Files
- \`.github/workflows/e2e-tests.yml\` - Main test workflow
- \`.github/workflows/scheduled-tests.yml\` - Scheduled test runs

### Local Workflow Validation
\`\`\`bash
# Validate workflows
npm run validate:workflows

# Test workflows locally
npm run test:workflow
\`\`\`

## 📁 Project Structure

\`\`\`
├── env/                    # Environment configurations
├── features/              # Cucumber feature files
├── src/
│   ├── config/           # Configuration files
│   ├── support/          # Support files and hooks
│   └── step_definitions/ # Step definitions
├── test-results/         # Test results and reports
├── cucumber.mjs          # Cucumber configuration
└── playwright.config.ts  # Playwright configuration
\`\`\`

## 🧪 Writing Tests

### Feature Files
Feature files are located in the \`features\` directory and follow Gherkin syntax:

\`\`\`gherkin
Feature: Logout

    @logout @smoke
    Scenario: As a logged-in user, I want to log out successfully
        Given I am logged in as "tester2025" with password "123456789aA!"
        When I logout
        Then I should be returned to the homepage
\`\`\`

### Step Definitions
Step definitions are organized by feature in \`src/step_definitions\`:

\`\`\`typescript
When('I logout', async function (this: CustomWorld) {
    await this.waitForTimeout(20000);
    try {
        await this.waitForSelector('//a[text()="Logout"]', { 
            state: 'visible', 
            timeout: config.timeouts.element 
        });
        // ... rest of the implementation
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
});
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## ✨ Acknowledgments

- [Playwright](https://playwright.dev/)
- [Cucumber.js](https://cucumber.io/docs/installation/javascript/)
- [TypeScript](https://www.typescriptlang.org/)
- [GitHub Actions](https://github.com/features/actions)