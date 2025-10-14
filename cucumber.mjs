// cucumber.mjs — for @cucumber/cucumber 12.x
export default {
  default: {
    // Load TypeScript support first
    requireModule: ['ts-node/register'],
    // If your project is ESM ("type":"module"), use:
    // requireModule: ['ts-node/esm'],

    // Load support + step files (use explicit files first)
    require: [
      './support/world.ts',
      './support/hooks.ts',
      './steps/example.steps.ts'
      // once it works, you can switch to './steps/**/*.ts'
    ],

    // Point to the feature(s)
    paths: ['./features/example.feature'],
    // later: ['./features/**/*.feature'],

    // Reporters must point to FILES, not directories
    format: [
      'progress',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],

    parallel: 0 // keep off while debugging
  }
};
