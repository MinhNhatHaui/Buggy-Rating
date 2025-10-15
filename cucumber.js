module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'src/step_definitions/**/*.ts',
      'src/support/**/*.ts'
    ],
    paths: ['features/**/*.feature'],
    format: [
      '@cucumber/pretty-formatter',
      'json:cucumber-report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    }
  }
}