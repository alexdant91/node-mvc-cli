const yargs = require('yargs');

const inquirer = require('./inquirer');
const actions = require('./actions');

const argv = yargs
  .command('init', 'Get started with node-mvc new project')
  .command('add', 'Install node-mvc plugin', {
    name: {
      alias: 'n',
      default: null
    }
  })
  .command('remove', 'Uninstall node-mvc plugin', {
    name: {
      alias: 'n',
      default: null
    }
  })
  .option('version', {
    alias: 'v',
    description: 'node-mvc-cli version',
    type: 'boolean',
  })
  .option('available-plugins', {
    alias: 'ap',
    description: 'node-mvc available plugin list',
    type: 'boolean',
  })
  .help()
  .alias('init', 'i')
  .alias('add', 'a')
  .alias('remove', 'r')
  .alias('version', 'v')
  .alias('help', 'h')
  .argv;

if (argv['available-plugins']) {
  actions.showAvailablePlugins();
}

// Include INIT
if (argv._.includes('init')) {
  (async () => {
    const options = await inquirer.askInit();

    await actions.generatePackageJsonFile(options);
  })();
} else if (argv._.includes('add')) {
  (async () => {
    // Install action
    actions.addPlugin(argv.name);
  })();
} else if (argv._.includes('remove')) {
  (async () => {
    // Install action
    actions.removePlugin(argv.name);
  })();
}
