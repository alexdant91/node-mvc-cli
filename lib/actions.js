const CLI = require('clui');
const Spinner = CLI.Spinner;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const emoji = require('node-emoji');

const Git = require('nodegit');
const clear = require('clear');

const replaceContents = (file, replacement, cb) => {
  fs.writeFile(file, replacement, cb);
}

module.exports = {
  showAvailablePlugins: () => {
    const plugins = require('./repository');
    console.table(plugins);
  },
  generatePackageJsonFile: async (options) => {
    const clone = Git.Clone.clone;
    const projName = options.name.toLowerCase().replace(/\s+/ig, '-');

    options.name = options.name.toLowerCase().replace(/\s+/ig, '-');

    console.log();

    const status = new Spinner("Generating new project.");
    status.start();

    const branches = {
      "Empty project": "clone-bare",
      "With Vue.js & Nuxt.js example": "clone"
    }

    const cloneOptions = new Git.CloneOptions();

    try {
      cloneOptions.checkoutBranch = branches[options.template];
      await clone("https://github.com/alexdant91/node-mvc", path.join(process.cwd(), projName), cloneOptions);

      const packageJSONTemplate = require('./console/cmd/templates/package')(options);

      replaceContents(path.join(process.cwd(), projName, './package.json'), packageJSONTemplate, () => {
        status.stop();

        console.log(chalk.bold.green(`${emoji.emojify(':heavy_check_mark:')} New project "${projName}" created ${emoji.emojify(':tada:')}`));
        console.log();
      });

    } catch (err) {
      status.stop();

      console.log(chalk.bold.red(`${emoji.emojify(':x:')} An error occur during creation process.`));
      console.log();
    }
  },
  addPlugin: async (name) => {
    clear();

    const clone = Git.Clone.clone;
    const nameParsed = name.replace("@nodemvc/", "");

    const status = new Spinner(`Installing ${name}...`);
    status.start();

    const cloneOptions = new Git.CloneOptions();

    if (fs.existsSync(path.join(process.cwd(), './Plugins', name))) {
      fs.rmdirSync(path.join(process.cwd(), './Plugins', name), { recursive: true });
    }

    try {
      cloneOptions.ignoreCertErrors = 1;
      cloneOptions.checkoutBranch = 'master';
      await clone(`https://github.com/alexdant91/nodemvc-${nameParsed}.git`, path.join(process.cwd(), './Plugins', name), cloneOptions);

      const nodeMvcConfigExist = fs.existsSync(path.join(process.cwd(), './nodemvc.config.js'));

      let nodeMvcConfigTemplate;

      if (nodeMvcConfigExist) {
        const nodeMvcConfig = require(path.join(process.cwd(), './nodemvc.config.js'));
        const findPlugin = nodeMvcConfig.plugins.find(item => item == name);
        if (findPlugin == null) nodeMvcConfig.plugins.push(name);
        nodeMvcConfigTemplate = `module.exports = ${JSON.stringify(nodeMvcConfig, null, 2)};`;
      } else {
        nodeMvcConfigTemplate = `module.exports = {
  plugins: [
    "${name}",
  ]
};`
      }

      fs.writeFile(path.join(process.cwd(), './nodemvc.config.js'), nodeMvcConfigTemplate, () => {
        status.stop();

        console.log(chalk.bold.green(`${emoji.emojify(':heavy_check_mark:')} Plugin "${name}" installed ${emoji.emojify(':tada:')}`));
      });

    } catch (err) {
      status.stop();
      // console.log(err)
      console.log(chalk.bold.red(`${emoji.emojify(':x:')} Plugin "${name}" not found`));
    }
  },
  removePlugin: async (name) => {
    clear();

    const status = new Spinner(`Removing ${name}...`);
    status.start();

    if (fs.existsSync(path.join(process.cwd(), './Plugins', name))) {
      fs.rmdirSync(path.join(process.cwd(), './Plugins', name), { recursive: true });
    }

    try {

      const nodeMvcConfigExist = fs.existsSync(path.join(process.cwd(), './nodemvc.config.js'));

      let nodeMvcConfigTemplate;

      if (nodeMvcConfigExist) {
        const nodeMvcConfig = require(path.join(process.cwd(), './nodemvc.config.js'));
        const index = nodeMvcConfig.plugins.indexOf(name);
        if (index !== -1) {
          nodeMvcConfig.plugins.splice(index, 1);
          nodeMvcConfigTemplate = `module.exports = ${JSON.stringify(nodeMvcConfig, null, 2)};`;
        } else {
          status.stop();

          console.log(chalk.bold.yellow(`${emoji.emojify(':x:')} Plugin "${name}" not installed`));
          return;
        }
      } else {
        nodeMvcConfigTemplate = `module.exports = {
  plugins: [
    "${name}",
  ]
};`
      }

      fs.writeFile(path.join(process.cwd(), './nodemvc.config.js'), nodeMvcConfigTemplate, () => {
        status.stop();

        console.log(chalk.bold.green(`${emoji.emojify(':heavy_check_mark:')} Plugin "${name}" removed`));
      });

    } catch (err) {
      status.stop();

      console.log(chalk.bold.red(`${emoji.emojify(':x:')} ${err.message}`));
    }
  }
}
