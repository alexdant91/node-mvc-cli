require('dotenv').config();
const clear = require('clear');
const chalk = require('chalk');
const bcrypt = require('bcryptjs');
const { exit } = require('process');
const { processArgv } = require('./helpers');

const options = processArgv();

clear();

/**
 * RESET ADMIN PASSWORD
 */

if (process.env.DB_CONNECTION === "mongo") {

  console.log(chalk.green.bold(`[NodeMVC]: Reset Admin password process...`));

  if (options.email) console.log(chalk.green(`${chalk.bold("[NodeMVC]: Admin email [")}${options.email ? chalk.white(options.email) : chalk.cyan("null")}${chalk.bold("]...")}`));
  else {
    console.log(chalk.red.bold(`[NodeMVC]: Admin email is required`));
    exit(0);
  }

  if (options.password) console.log(chalk.green(`${chalk.bold("[NodeMVC]: Admin new password [")}${options.password ? chalk.white(options.password) : chalk.cyan("null")}${chalk.bold("]...")}`));
  else {
    console.log(chalk.red.bold(`[NodeMVC]: Admin password is required`));
    exit(0);
  }

  const { asyncConnect, disconnect, models: db } = require('../../Database/config/mongo');

  (async () => {
    try {
      await asyncConnect();

      options.password = await bcrypt.hash(options.password, 12);

      await db.Admin.updateOne({ email: options.email }, { password: options.password });

      await disconnect();

      console.log(chalk.green.bold(`[NodeMVC]: Operation successfully done...`));
      exit(0);
    } catch (err) {
      console.log(chalk.red.bold(`[NodeMVC]: ${err.message}`));
      exit(0);
    }
  })();
} else if (process.env.DB_CONNECTION === "pgsql") {
  // TODO: logic for pgsql database
} else if (process.env.DB_CONNECTION === "mysql") {
  // TODO: logic for mysql database
}
