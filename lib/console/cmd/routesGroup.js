require('dotenv').config();
const clear = require('clear');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { exit } = require('process');
const { processArgv } = require('./helpers');

clear();

console.log(chalk.green.bold(`[NodeMVC]: Generating new Router...`));

const options = processArgv();

const Name = options.name;
const SubDir = options.subfolder ? options.subfolder : '/';

const ModelNameArgv = Name ? Name.charAt(0).toUpperCase() + Name.slice(1) : process.argv.slice(2).toString().charAt(0).toUpperCase() + process.argv.slice(2).toString().slice(1);

// const ModelNameArgv = process.argv.slice(2).toString().charAt(0).toUpperCase() + process.argv.slice(2).toString().slice(1);

if (!ModelNameArgv || ModelNameArgv == "") {
  console.log(chalk.red.bold(`[NodeMVC]: Router name required, run \`yarn make:router [ROUTER_NAME]\``));
  exit(0);
}

const ModelName = ModelNameArgv.replace(/routes/ig, "");

const RouterSubPath = path.join(__dirname, "../../../app/Routes/Groups", SubDir);

if (!fs.existsSync(RouterSubPath)) fs.mkdirSync(RouterSubPath);

const RouterPath = path.join(RouterSubPath, `${ModelName}Routes.js`);

const RouterTemplate = require('./templates/routeGroup');

// const RouterPath = path.join(__dirname, "../../../app/Routers/Groups", `${ModelName}Routes.js`);

const RouterCode = RouterTemplate.split("%__MODEL_NAME__%").join(ModelName).split("%__MODEL_MIN_NAME__%").join(ModelName.toLowerCase());

fs.writeFileSync(RouterPath, RouterCode);

console.log(chalk.green.bold(`[NodeMVC]: Router "${ModelName}Routes" successfully created.`));
