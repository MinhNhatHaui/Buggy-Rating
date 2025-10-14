const reporter = require('cucumber-html-reporter');

const options = {
    theme: 'bootstrap',
    jsonFile: 'cucumber-report.json',
    output: 'cucumber-report.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true,
    storeScreenshots: true,
    noInlineScreenshots: false,
    screenshotsDirectory: 'screenshots/',
    metadata: {
        "App Version": "1.0.0",
        "Test Environment": "Local",
        "Browser": "Chrome",
        "Platform": "Windows",
        "Parallel": "Scenarios",
        "Executed": "Remote"
    }
};

reporter.generate(options);