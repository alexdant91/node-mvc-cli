require('dotenv').config();
const clear = require('clear');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const appKey = require('crypto').randomBytes(48).toString('hex');

clear();

console.log(chalk.green.bold(`[NodeMVC]: Generating new .env file...`));

const AppNameArgv = process.argv.slice(2).toString();

if (!AppNameArgv || AppNameArgv == "") {
  console.log(chalk.red.bold(`[NodeMVC]: App name required, run \`yarn make:env [APP_NAME]\``));
  exit(0);
}

const AppName = AppNameArgv.replace(/controller/ig, "");

const EnvTemplate = require('./templates/env');

const EnvPath = path.join(__dirname, "../../../.env",);

const EnvCode = EnvTemplate.split("%__MODEL_NAME__%").join(AppName).split("%__MODEL_MIN_NAME__%").join(AppName.toLowerCase()).split("%__APP_KEY__%").join(appKey);

fs.unlinkSync(EnvPath);
fs.writeFileSync(EnvPath, EnvCode);

console.log(chalk.green.bold(`[NodeMVC]: Enviroment for "${AppName}" successfully created.`));
