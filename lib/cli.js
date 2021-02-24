const yargs = require('yargs');

const inquirer = require('./inquirer');
const actions = require('./actions');

const argv = yargs
  .command('init', 'Get started with node-mvc new project')
  .option('version', {
    alias: 'v',
    description: 'node-mvc-cli version',
    type: 'boolean',
  })
  .help()
  .alias('version', 'v')
  .alias('help', 'h')
  .argv;

// if (argv.time) {
//   console.log('The current time is: ', new Date().toLocaleTimeString());
// }

// Include INIT
if (argv._.includes('init')) {
  (async () => {
    const options = await inquirer.askInit();

    await actions.generatePackageJsonFile(options);
  })();
} else if (argv._.includes('example')) {
  (async () => {
    inquirer.cluiExample()

  })();
}
