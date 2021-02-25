const inquirer = require('inquirer');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

module.exports = {
  askInit: () => {
    clear();

    console.log(
      chalk.yellow(
        figlet.textSync('NodeMVC', { horizontalLayout: 'full' })
      )
    );

    console.log();

    const questions = [
      {
        name: 'name',
        type: 'input',
        message: 'Enter a project name:',
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your project name.';
          }
        }
      },
      {
        name: 'version',
        type: 'input',
        message: 'Project version:',
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your version.';
          }
        },
        default: '0.0.1'
      },
      {
        name: 'description',
        type: 'input',
        message: 'Enter project\'s description:',
      },
      {
        name: 'repository',
        type: 'input',
        message: 'Project repository:',
      },
      {
        name: 'author',
        type: 'input',
        message: 'Project author:',
      },
      {
        name: 'license',
        type: 'input',
        message: 'Project license:',
        default: 'MIT'
      },
      {
        type: 'confirm',
        name: 'private',
        message: 'Is a private project:',
        default: false
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choose your initial template:',
        choices: ['Empty project', 'With Vue.js & Nuxt.js example'],
        default: ['Empty project']
      }
    ];

    return inquirer.prompt(questions);
  },
};
