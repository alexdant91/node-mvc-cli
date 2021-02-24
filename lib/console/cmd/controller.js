require('dotenv').config();
const clear = require('clear');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { exit } = require('process');
const { processArgv } = require('./helpers');

clear();

console.log(chalk.green.bold(`[NodeMVC]: Generating new Controller...`));

const options = processArgv();

const Name = options.name;
const SubDir = options.subfolder ? options.subfolder : '/';

const ModelNameArgv = Name ? Name.charAt(0).toUpperCase() + Name.slice(1) : process.argv.slice(2).toString().charAt(0).toUpperCase() + process.argv.slice(2).toString().slice(1);

// const ModelNameArgv = process.argv.slice(2).toString().charAt(0).toUpperCase() + process.argv.slice(2).toString().slice(1);

if (!ModelNameArgv || ModelNameArgv == "") {
  console.log(chalk.red.bold(`[NodeMVC]: Controller name required, run \`yarn make:controller [CONTROLLER_NAME]\``));
  exit(0);
}

const ModelName = ModelNameArgv.replace(/controller/ig, "");

const ControllerSubPath = path.join(__dirname, "../../../app/Http/Controllers", SubDir);

if (!fs.existsSync(ControllerSubPath)) fs.mkdirSync(ControllerSubPath);

const ControllerPath = path.join(ControllerSubPath, `${ModelName}.js`);

const ControllerTemplate = require('./templates/controllerOnly');

// const ControllerPath = path.join(__dirname, "../../../app/Http/Controllers/", `${ModelName}Controller.js`);

const ControllerCode = ControllerTemplate.split("%__MODEL_NAME__%").join(ModelName).split("%__MODEL_MIN_NAME__%").join(ModelName.toLowerCase());

fs.writeFileSync(ControllerPath, ControllerCode);

console.log(chalk.green.bold(`[NodeMVC]: Controller "${ModelName}" successfully created.`));
