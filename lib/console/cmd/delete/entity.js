require('dotenv').config();
const clear = require('clear');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { exit } = require('process');

const { migrate } = require('../helpers');

clear();

const ModelName = process.argv.slice(2).toString().charAt(0).toUpperCase() + process.argv.slice(2).toString().slice(1)

if (!ModelName || ModelName == "") {
  console.log(chalk.red.bold(`[NodeMVC]: Model name required, run \`yarn delete:model [MODEL_NAME]\``));
  exit(0);
}

const ModelPath = path.join(__dirname, "../../../../app/Models/", `${ModelName}.js`);
const ControllerPath = path.join(__dirname, "../../../../app/Http/Controllers/", `${ModelName}Controller.js`);
const DatabasePath = path.join(__dirname, "../../../../database/models/", `${ModelName}.js`);
const TestsPath = path.join(__dirname, "../../../../tests/", `${ModelName.toLowerCase()}.test.js`);

fs.unlinkSync(ModelPath);
console.log(chalk.green.bold(`[NodeMVC]: Deleting "${ModelName}" Model...`));
fs.unlinkSync(ControllerPath);
console.log(chalk.green.bold(`[NodeMVC]: Deleting "${ModelName}Controller" Controller...`));
fs.unlinkSync(DatabasePath);
console.log(chalk.green.bold(`[NodeMVC]: Deleting "${ModelName}" Database Schema...`));
fs.unlinkSync(TestsPath);
console.log(chalk.green.bold(`[NodeMVC]: Deleting "${ModelName}" Default Tests Suite...`));

// Remove model from default USER group role if exists
if (process.env.DB_CONNECTION === "mongo") {
  const { asyncConnect, disconnect, models: db } = require(`../../../Database/config/mongo`);

  (async () => {
    try {
      await asyncConnect();

      console.log(chalk.green.bold(`[NodeMVC]: Removing default role for ADMIN group if exists...`));

      const USER_ROLE = await db.Role.findOne({ group_name: "ADMIN" }, null, { lean: true });
      if (USER_ROLE != null) {
        await db.Role.updateOne(
          { group_name: "ADMIN" },
          { $pull: { auth_models: { model_ref_name: ModelName } } }
        );
      }

      console.log(chalk.green.bold(`[NodeMVC]: Removing default role for USER group if exists...`));

      const USER_ROLE = await db.Role.findOne({ group_name: "USER" }, null, { lean: true });
      if (USER_ROLE != null) {
        await db.Role.updateOne(
          { group_name: "USER" },
          { $pull: { auth_models: { model_ref_name: ModelName } } }
        );
      }

      await disconnect();
    } catch (err) {
      console.log(chalk.red.bold(`[NodeMVC]: ${err.message}`));
      exit(0);
    }

  })();
}

migrate();

// console.log(chalk.green.bold(`[NodeMVC]: Operation successfully done.`));
