require('dotenv').config();
const clear = require('clear');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { exit } = require('process');
const { processArgv } = require('./helpers');

clear();

console.log(chalk.green.bold(`[NodeMVC]: Generating new Middleware...`));

const options = processArgv();

const Name = options.name;
const SubDir = options.subfolder ? options.subfolder : '/';

const ModelName = Name ? Name.charAt(0).toUpperCase() + Name.slice(1) : process.argv.slice(2).toString().charAt(0).toUpperCase() + process.argv.slice(2).toString().slice(1);

// const ModelName = process.argv.slice(2).toString().charAt(0).toUpperCase() + process.argv.slice(2).toString().slice(1)

if (!ModelName || ModelName == "") {
  console.log(chalk.red.bold(`[NodeMVC]: Middleware name required, run \`yarn make:middleware [MIDDLEWARE_NAME]\``));
  exit(0);
}

const MiddlewareTemplate = require('./templates/middleware');

const MiddlewareSubPath = path.join(__dirname, "../../../app/Http/Middleware", SubDir);

if (!fs.existsSync(MiddlewareSubPath)) fs.mkdirSync(MiddlewareSubPath);

const MiddlewarePath = path.join(MiddlewareSubPath, `${ModelName}.js`);

// const MiddlewarePath = path.join(__dirname, "../../../app/Http/Middleware/", `${ModelName}.js`);

const MiddlewareCode = MiddlewareTemplate.split("%__MODEL_NAME__%").join(ModelName).split("%__MODEL_MIN_NAME__%").join(ModelName.toLowerCase());

fs.writeFileSync(MiddlewarePath, MiddlewareCode);

console.log(chalk.green.bold(`[NodeMVC]: Middleware "${ModelName}" successfully created.`));
