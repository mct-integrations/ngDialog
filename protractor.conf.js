var args = process.argv.slice(2);
var plugins = [];

if (args.indexOf('--a11y') > -1) {
    plugins.push({
        path: 'node_modules/protractor/plugins/accessibility',
        chromeA11YDevTools: {
            treatWarningsAsFailures: true
        }
    });
}

if (args.indexOf('--console-warning') > -1 || args.indexOf('--console-error') > -1) {
    plugins.push({
        path: 'node_modules/protractor/plugins/console',
        failOnWarning: args.indexOf('--console-warning') > -1,
        failOnError: args.indexOf('--console-error') > -1
    })
}

module.exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  allScriptsTimeout: 11000,
  specs: ['tests/protractor/**/*.js'],
  multiCapabilities: [{
    browserName: 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    name: 'ngDialog Protractor'
  },
  {
    browserName: 'firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    name: 'ngDialog Protractor'
  },
  {
      browserName: 'internet explorer',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      name: 'ngDialog Protractor',
      browserVersion: 10
  }],
  framework: 'jasmine',
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },
  sauceSeleniumAddress: 'localhost:4445/wd/hub',
  plugins: plugins
};