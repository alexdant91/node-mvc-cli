require('dotenv').config();
const clear = require('clear');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

clear();

const ModelName = process.argv.slice(2).toString().charAt(0).toUpperCase() + process.argv.slice(2).toString().slice(1)

if (!ModelName || ModelName == "") {
  console.log(chalk.red.bold(`[NodeMVC]: Middleware name required, run \`yarn delete:middleware [MIDDLEWARE_NAME]\``));
  exit(0);
}

const MiddlewarePath = path.join(__dirname, "../../../../app/Http/Middleware/", `${ModelName}.js`);

fs.unlinkSync(MiddlewarePath);
console.log(chalk.green.bold(`[NodeMVC]: Middleware "${ModelName}" successfully deleted.`));
