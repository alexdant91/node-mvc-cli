require('dotenv').config();

const processArgv = () => {
  process.argv.splice(0, 2);

  const argv = process.argv;

  const config = {};

  const commandMap = {
    m: "migrate",
    M: "migrate",
    n: "name",
    N: "name",
    S: "subfolder",
    sub: "subfolder",
  }

  let sub;
  argv.forEach((arg, i) => {
    if (i == 0 && !arg.startsWith('-')) {
      arg = arg == 'true' ? true : arg;
      arg = arg == 'false' ? false : arg;
      config.name = arg;
    } else {
      if (arg.startsWith('-')) {
        const key = arg.replace(/-|--/ig, '');
        if (commandMap[key]) sub = commandMap[key];
        else sub = key;
        config[sub] = true;
      } else {
        arg = arg == 'true' ? true : arg;
        arg = arg == 'false' ? false : arg;
        config[sub] = arg;
      }
    }
  });

  return config;
}

module.exports.processArgv = processArgv;


const migrate = async () => {
  const fs = require('fs');
  const path = require('path');
  const chalk = require('chalk');
  const pluralize = require('pluralize');
  const { exit } = require('process');

  if (process.env.DB_CONNECTION === "mongo") {
    const { Imports, PartialSchema, PartialExports, PartialExportsExport, SchemasTemplate } = require('./templates/schemas');

    const SchemaPath = path.join(__dirname, `../../../vendor/Database/schema/${process.env.DB_CONNECTION}.Schemas.js`);
    const ModelsDirPath = path.join(__dirname, `../../../database/models`);

    const files = fs.readdirSync(ModelsDirPath);

    let ImportsCode = Imports, PartialSchemaCodes = [], PartialExportsCodes = [];

    let userRolesObjs = [], adminRolesObjs = [], excludedUserDefaultModels = ["user", "users", "admin", "admins"], excludedAdminDefaultModels = ["user", "users", "admin", "admins"];

    for (file of files) {
      const ModelName = file.replace(".js", "");
      PartialSchemaCodes.push(PartialSchema.split("%__MODEL_NAME__%").join(ModelName).split("%__MODEL_MIN_NAME__%").join(ModelName.toLowerCase()));
      PartialExportsCodes.push(PartialExports.split("%__MODEL_NAME__%").join(ModelName).split("%__MODEL_MIN_NAME__%").join(ModelName.toLowerCase()));
      console.log(chalk.green.bold(`[NodeMVC]: Migrating "${ModelName}" schema...`));

      if (excludedUserDefaultModels.indexOf(ModelName.toLowerCase()) === -1) {
        userRolesObjs.push({ create: true, read: true, update: true, delete: true, model_ref_name: ModelName, restrict_to_owner: true, owner_field_name: "user_id" }); adminRolesObjs.push({ create: true, read: true, update: true, delete: true, model_ref_name: ModelName, restrict_to_owner: false, owner_field_name: null });
      }

      if (excludedAdminDefaultModels.indexOf(ModelName.toLowerCase()) === -1) {
        adminRolesObjs.push({ create: true, read: true, update: true, delete: true, model_ref_name: ModelName, restrict_to_owner: false, owner_field_name: null });
      }
    }

    PartialExportsExportCode = PartialExportsExport.replace("%__PARTIAL_EXPORTS__%", PartialExportsCodes.join(""));

    const SchemasCode = SchemasTemplate.split("%__IMPORTS__%").join(ImportsCode).split("%__SCHEMAS__%").join(PartialSchemaCodes.join("")).split("%__PARTIAL__%").join(PartialExportsExportCode);

    fs.unlinkSync(SchemaPath);
    fs.writeFileSync(SchemaPath, SchemasCode);

    // Generate user and admin default roles if not exists
    const { asyncConnect, disconnect, models: db } = require(`../../Database/config/mongo`);
    try {
      await asyncConnect();

      console.log(chalk.green.bold(`[NodeMVC]: Migrating default settings...`));

      const OWNER_ROLE = await db.Role.findOne({ group_name: "OWNER" }, null, { lean: true });
      if (OWNER_ROLE == null) await new db.Role({ group_name: "OWNER", is_auth_all_models: true }).save();

      const ADMIN_ROLE = await db.Role.findOne({ group_name: "ADMIN" }, null, { lean: true });
      if (ADMIN_ROLE == null) await new db.Role({
        group_name: "ADMIN",
        is_auth_all_models: false,
        auth_models: [
          // Default admin self permission
          { create: false, read: true, update: true, delete: false, model_ref_name: "Admin", restrict_to_owner: true, owner_field_name: "admin_id" },
          // Default user permission
          { create: true, read: true, update: true, delete: true, model_ref_name: "User", restrict_to_owner: false, owner_field_name: null },
          // Default user models permissions
          ...adminRolesObjs,
        ]
      }).save();

      const USER_ROLE = await db.Role.findOne({ group_name: "USER" }, null, { lean: true });
      if (USER_ROLE == null) await new db.Role({
        group_name: "USER",
        is_auth_all_models: false,
        auth_models: [
          // Default user self permission
          { create: false, read: true, update: true, delete: true, model_ref_name: "User", restrict_to_owner: true, owner_field_name: "user_id", },
          // Default admin self permission
          { create: false, read: false, update: false, delete: false, model_ref_name: "Admin", restrict_to_owner: false, owner_field_name: null },
          // Default user models permissions
          ...userRolesObjs,
        ]
      }).save();

      await disconnect();
    } catch (err) {
      console.log(chalk.red.bold(`[NodeMVC]: ${err.message}`));
      exit(0);
    }

    console.log(chalk.green.bold(`[NodeMVC]: Migration successfully done.`));
  } else if (process.env.DB_CONNECTION === "pgsql") {
    const { connect, client } = require('../../Database/config/pgsql');
    const { Varchar, Text, String, Array, Number, Boolean, Date } = require('../../Database/types/pgsql');

    (async () => {
      await connect();

      fs.readdir(path.join(__dirname, '../../../database/models'), async (err, files) => {
        if (err) {
          console.log(chalk.red.bold(`[NodeMVC]: Error on migration.`));
          throw err;
        }

        let index = 0;
        let done = false;
        for (file of files) {
          index++;
          const tablesModel = require(`../../../database/models/${file}`)();
          const table = pluralize(file.replace('.js', '').toLowerCase());
          const fields = Object.keys(tablesModel).map(key => {
            const name = key;
            const column = tablesModel[key];
            const unique = column.unique ? ' UNIQUE' : '';
            const isNull = column.default && column.default === null ? ' NULL' : ` NOT NULL`;
            const defaultValue = column.default ? ` DEFAULT ${column.default}` : '';
            let type;

            if (column.type === String) {
              if (column.length <= 255) {
                type = `VARCHAR(${column.length})`;
              } else {
                type = `TEXT`;
              }
            } else if (column.type === Varchar) {
              type = 'VARCHAR'
            } else if (column.type === Text) {
              type = 'TEXT'
            } else if (column.type === Array) {
              type = 'ARRAY'
            } else if (column.type === Number) {
              type = 'DECIMALS'
            } else if (column.type === Boolean) {
              type = 'BOOLEAN'
            } else if (column.type === Date) {
              type = 'DATE'
            }

            return `${name} ${type}${unique}${isNull}${defaultValue}`;
          });

          // console.log(`CREATE TABLE IF NOT EXISTS ${table} (id SERIAL, ${fields.join(", ")})`)
          // console.log(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${fields.join(", ADD COLUMN IF NOT EXISTS ")}`)

          client.query(`CREATE TABLE IF NOT EXISTS ${table} (id SERIAL, ${fields.join(", ")})`, (err) => {
            if (err) throw err;
            client.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${fields.join(", ADD COLUMN IF NOT EXISTS ")}`, (err) => {
              if (err) throw err;

              console.log(chalk.green.bold(`[NodeMVC]: Migrating table "${table}"...`));
              if (index == files.length) {

                // TODO: Generate user and admin default roles if not exists

                done = true;
              }
            });
          });


          let timer = setInterval(() => {
            if (done == true) {
              clearInterval(timer);
              console.log(chalk.green.bold(`[NodeMVC]: Migration successfully done.`));
              exit(0);
            }
          }, 100)
        };

      });

    })()

  } else if (process.env.DB_CONNECTION === "mysql") {
    // TODO: MySql migration here

    console.log(chalk.green.bold(`[NodeMVC]: Migration successfully done.`));
  }
}

module.exports.migrate = migrate;
