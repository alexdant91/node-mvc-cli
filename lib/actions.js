const CLI = require('clui');
const Spinner = CLI.Spinner;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const emoji = require('node-emoji');

const Git = require('nodegit');
const clone = Git.Clone.clone;
const branch = 'clone';
const cloneOptions = new Git.CloneOptions();

module.exports = {
  generatePackageJsonFile: async (options) => {
    const projName = options.name.toLowerCase().replace(/\s+/ig, '-');

    console.log();

    const status = new Spinner("Generating new project.");
    status.start();

    try {
      // TODO: Sostituire con repo pubblica che permette modifiche
      cloneOptions.checkoutBranch = branch;
      await clone("https://github.com/alexdant91/node-mvc", path.join(process.cwd(), projName), cloneOptions);

      //
      status.stop();

      console.log(chalk.bold.green(`${emoji.emojify(':heavy_check_mark:')} New project "${projName}" created ${emoji.emojify(':tada:')}`));
      console.log();
    } catch (err) {
      //
      status.stop();

      console.log(chalk.bold.red(`${emoji.emojify(':x:')} An error occur during creation process.`));
      console.log();
    }
  }
}
