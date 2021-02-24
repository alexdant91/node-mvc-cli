require('dotenv').config();
const clear = require('clear');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { exit } = require('process');

clear();

console.log(chalk.green.bold(`[NodeMVC]: Generating new Entity...`));

const ModelName = process.argv.slice(2).toString().charAt(0).toUpperCase() + process.argv.slice(2).toString().slice(1)

if (!ModelName || ModelName == "") {
  console.log(chalk.red.bold(`[NodeMVC]: Entity name required, run \`yarn make:entity [ENTITY_NAME]\``));
  exit(0);
}

const ModelTemplate = require('./templates/model');
const ControllerTemplate = require('./templates/controller');
const DatabaseTemplate = require(`./templates/database.${process.env.DB_CONNECTION}`);
const TestsTemplate = require('./templates/tests');

const ModelPath = path.join(__dirname, "../../../app/Models/", `${ModelName}.js`);
const ControllerPath = path.join(__dirname, "../../../app/Http/Controllers/", `${ModelName}Controller.js`);
const DatabasePath = path.join(__dirname, "../../../database/models/", `${ModelName}.js`);
const TestsPath = path.join(__dirname, "../../../tests/", `${ModelName.toLowerCase()}.test.js`);

const ModelCode = ModelTemplate.split("%__MODEL_NAME__%").join(ModelName).split("%__MODEL_MIN_NAME__%").join(ModelName.toLowerCase());
const ControllerCode = ControllerTemplate.split("%__MODEL_NAME__%").join(ModelName).split("%__MODEL_MIN_NAME__%").join(ModelName.toLowerCase());
const DatabaseCode = DatabaseTemplate.split("%__MODEL_NAME__%").join(ModelName).split("%__MODEL_MIN_NAME__%").join(ModelName.toLowerCase());
const TestsCode = TestsTemplate.split("%__MODEL_NAME__%").join(ModelName).split("%__MODEL_MIN_NAME__%").join(ModelName.toLowerCase());

fs.writeFileSync(ModelPath, ModelCode);
console.log(chalk.green.bold(`[NodeMVC]: Generating "${ModelName}" Model...`));
fs.writeFileSync(ControllerPath, ControllerCode);
console.log(chalk.green.bold(`[NodeMVC]: Generating "${ModelName}Controller" Controller...`));
fs.writeFileSync(DatabasePath, DatabaseCode);
console.log(chalk.green.bold(`[NodeMVC]: Generating "${ModelName}" Database Schema...`));
fs.writeFileSync(TestsPath, TestsCode);
console.log(chalk.green.bold(`[NodeMVC]: Generating "${ModelName}" Default Tests Suite...`));

// Push default USER permissions if USER group exists
if (process.env.DB_CONNECTION === "mongo") {
  const { asyncConnect, disconnect, models: db } = require(`../../Database/config/mongo`);

  (async () => {
    try {
      await asyncConnect();

      console.log(chalk.green.bold(`[NodeMVC]: Generating default role for ADMIN group if exists...`));

      const ADMIN_ROLE = await db.Role.findOne({ group_name: "ADMIN" }, null, { lean: true });
      if (ADMIN_ROLE != null) {
        const findRule = ADMIN_ROLE.auth_models.find(role => role.model_ref_name == ModelName);
        if (findRule == null) {
          await db.Role.updateOne({ group_name: "ADMIN" },
            {
              $push: {
                auth_models: {
                  create: true,
                  read: true,
                  update: true,
                  delete: true,
                  model_ref_name: ModelName,
                  restrict_to_owner: false,
                  owner_field_name: null,
                }
              }
            }
          );
        }
      }

      console.log(chalk.green.bold(`[NodeMVC]: Generating default role for USER group if exists...`));

      const USER_ROLE = await db.Role.findOne({ group_name: "USER" }, null, { lean: true });
      if (USER_ROLE != null) {
        const findRule = USER_ROLE.auth_models.find(role => role.model_ref_name == ModelName);
        if (findRule == null) {
          await db.Role.updateOne({ group_name: "USER" },
            {
              $push: {
                auth_models: {
                  create: false,
                  read: true,
                  update: false,
                  delete: false,
                  model_ref_name: ModelName,
                  restrict_to_owner: false,
                  owner_field_name: "user_id",
                }
              }
            }
          );
        }
      }

      await disconnect();
    } catch (err) {
      console.log(chalk.red.bold(`[NodeMVC]: ${err.message}`));
      exit(0);
    }

  })();
}

console.log(chalk.green.bold(`[NodeMVC]: Operation successfully done.`));
