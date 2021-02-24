require('dotenv').config();
const clear = require('clear');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { exit } = require('process');

clear();

const ModelName = process.argv.slice(2).toString().charAt(0).toUpperCase() + process.argv.slice(2).toString().slice(1)

if (!ModelName || ModelName == "") {
  console.log(chalk.red.bold(`[NodeMVC]: Model name required, run \`yarn delete:controller [CONTROLLER_NAME]\``));
  exit(0);
}

const ControllerPath = path.join(__dirname, "../../../../app/Http/Controllers/", `${ModelName}Controller.js`);

fs.unlinkSync(ControllerPath);
console.log(chalk.green.bold(`[NodeMVC]: Controller "${ModelName}Controller" successfully deleted.`));
