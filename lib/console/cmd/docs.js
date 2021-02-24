// Init global configurations
const { init } = require('../../init');
const { exit } = require('process');
init.config();

const Route = require('../../Routes/Route');
const Docs = require('../../Docs');
const { ServerMiddelware, StaticMiddleware, ApiRoutes, AuthRoutes, WebRoutes } = require('../../Routes/kernel');
const chalk = require('chalk');
const clear = require('clear');

clear();

const staticMiddlewarePaths = [{ pathname: '/public/assets', dir: '/public/assets' }];

ServerMiddelware.init(Route);

WebRoutes.init(Route, '/');
ApiRoutes.init(Route, '/api');
AuthRoutes.init(Route, '/auth');

// Init static middleware passing an array of paths.
// Requires in order to set custom auth logic to
// static files or folders
StaticMiddleware.init(Route, staticMiddlewarePaths);

Route.listen(env.APP_PORT, () => {
  if (process.env.APP_DEBUG) console.log(chalk.green.bold(`[NodeMVC]: Server successfully started on ${env.APP_URL}:${env.APP_PORT} in ${env.APP_ENV} mode.`));
  // Generate new documentation if needed
  // Append specs to existed
  console.log(chalk.green.bold('[NodeMVC]: Stating server routes map...'));
  new Docs(Route).generateSpecs();

  console.log(chalk.green.bold('[NodeMVC]: Process successfully done.'));
  exit(0);
});
