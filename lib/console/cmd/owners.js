require('dotenv').config();
const clear = require('clear');
const chalk = require('chalk');
const bcrypt = require('bcryptjs');
const { exit } = require('process');
const { processArgv } = require('./helpers');

const options = processArgv();

clear();

console.log(chalk.green.bold(`[NodeMVC]: Generating new Owner...`));

console.log(chalk.green(`${chalk.bold("[NodeMVC]: Owner first name [")}${options.firstName ? chalk.white(options.firstName) : chalk.cyan("null")}${chalk.bold("]...")}`));
console.log(chalk.green(`${chalk.bold("[NodeMVC]: Owner last name [")}${options.lastName ? chalk.white(options.lastName) : chalk.cyan("null")}${chalk.bold("]...")}`));

if (options.email) console.log(chalk.green(`${chalk.bold("[NodeMVC]: Owner email [")}${options.email ? chalk.white(options.email) : chalk.cyan("null")}${chalk.bold("]...")}`));
else {
  console.log(chalk.red.bold(`[NodeMVC]: Owner email is required`));
  exit(0);
}

if (options.password) console.log(chalk.green(`${chalk.bold("[NodeMVC]: Owner password [")}${options.password ? chalk.white(options.password) : chalk.cyan("null")}${chalk.bold("]...")}`));
else {
  console.log(chalk.red.bold(`[NodeMVC]: Owner password is required`));
  exit(0);
}

console.log(chalk.green(`${chalk.bold("[NodeMVC]: Owner avatar [")}${options.avatar ? chalk.white(options.avatar) : chalk.cyan("null")}${chalk.bold("]...")}`));
console.log(chalk.green(`${chalk.bold("[NodeMVC]: Owner role group [")}${chalk.white("OWNER")}${chalk.bold("]...")}`));

if (process.env.DB_CONNECTION === "mongo") {

  const { asyncConnect, disconnect, models: db } = require('../../Database/config/mongo');

  (async () => {
    try {
      await asyncConnect();

      const findAdmin = await db.Admin.findOne({ email: options.email }, null, { lean: true });

      if (findAdmin != null) {
        console.log(chalk.red(`${chalk.bold("[NodeMVC]: You already have an Admin with [")}${chalk.white(options.email)}${chalk.bold("] email")}`));
        console.log(chalk.red.bold(`[NodeMVC]: Operation aborted...`));
        await disconnect();
        exit(0);
      }

      const findUser = await db.User.findOne({ email: options.email }, null, { lean: true });

      if (findUser != null) {
        console.log(chalk.red(`${chalk.bold("[NodeMVC]: You already have a User with [")}${chalk.white(options.email)}${chalk.bold("] email")}`));
        console.log(chalk.red.bold(`[NodeMVC]: Operation aborted...`));
        await disconnect();
        exit(0);
      }

      options.password = await bcrypt.hash(options.password, 12);

      await new db.Owner({ ...options }).save();

      await disconnect();

      console.log(chalk.green.bold(`[NodeMVC]: Operation successfully done...`));
      exit(0);
    } catch (err) {
      console.log(chalk.red.bold(`[NodeMVC]: ${err.message}`));
      console.log(chalk.red.bold(`[NodeMVC]: Operation aborted...`));
      exit(0);
    }
  })();

} else if (process.env.DB_CONNECTION === "pgsql") {
  // TODO: logic for pgsql database
} else if (process.env.DB_CONNECTION === "mysql") {
  // TODO: logic for mysql database
}
