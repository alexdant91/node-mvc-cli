require('dotenv').config();
const clear = require('clear');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { exit } = require('process');
const { processArgv } = require('./helpers');

clear();

console.log(chalk.green.bold(`[NodeMVC]: Generating new Service...`));

const options = processArgv();

const Name = options.name;
const SubDir = options.subfolder ? options.subfolder : '/';

const ModelNameArgv = Name ? Name.charAt(0).toUpperCase() + Name.slice(1) : process.argv.slice(2).toString().charAt(0).toUpperCase() + process.argv.slice(2).toString().slice(1);

if (!ModelNameArgv || ModelNameArgv == "") {
  console.log(chalk.red.bold(`[NodeMVC]: Service name required, run \`yarn make:service [SERVICE_NAME]\``));
  exit(0);
}

const ModelName = ModelNameArgv.replace(/controller/ig, "");

const ServiceTemplate = require('./templates/service');

const ServiceSubPath = path.join(__dirname, "../../../app/Services", SubDir);

if (!fs.existsSync(ServiceSubPath)) fs.mkdirSync(ServiceSubPath);

const ServicePath = path.join(ServiceSubPath, `${ModelName}.js`);

const ServiceCode = ServiceTemplate.split("%__MODEL_NAME__%").join(ModelName).split("%__MODEL_MIN_NAME__%").join(ModelName.toLowerCase());

fs.writeFileSync(ServicePath, ServiceCode);

console.log(chalk.green.bold(`[NodeMVC]: Service "${ModelName}" successfully created.`));
