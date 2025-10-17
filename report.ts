import reporter from 'cucumber-html-reporter';

const options: reporter.Options = {
    theme: 'bootstrap',
    jsonFile: 'cucumber-report.json',
    output: './test-results/cucumber-report.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true,
    screenshotsDirectory: 'test-results/screenshots/',
    storeScreenshots: true,
    noInlineScreenshots: false,
    metadata: {
        "App Version": "1.0.0",
        "Test Environment": "Local",
        "Browser": "Chrome",
        "Platform": "Windows",
        "Parallel": "Scenarios",
        "Executed": "Remote"
    },
    brandTitle: "Test Automation Report",
    name: "Buggy Rating Tests"
};

reporter.generate(options);