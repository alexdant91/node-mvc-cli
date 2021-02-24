const clear = require('clear');

module.exports.debug = {
  neutral(message, clearTerminal = false) {
    if (clearTerminal) clear();
    log(`[NodeMVC]: ${message} – ${new Date().toISOString()}`);
  },
  success(message, clearTerminal = false) {
    if (clearTerminal) clear();
    log(chalk.green(`[NodeMVC]: ${message} – ${new Date().toISOString()}`));
  },
  successBanner(message) {
    clear();
    log(chalk.green.bgGreen(`   [NodeMVC]: ${message} – ${new Date().toISOString()}   `));
    log(chalk.bgGreen.bold(`   [NodeMVC]: ${message} – ${new Date().toISOString()}   `));
    log(chalk.green.bgGreen(`   [NodeMVC]: ${message} – ${new Date().toISOString()}   `));
    log();
  },
  warning(message, clearTerminal = false) {
    if (clearTerminal) clear();
    log(chalk.yellow(`[NodeMVC]: ${message} – ${new Date().toISOString()}`));
  },
  warningBanner(message) {
    clear();
    log(chalk.yellow.bgYellow(`   [NodeMVC]: ${message} – ${new Date().toISOString()}   `));
    log(chalk.bgYellow.bold(`   [NodeMVC]: ${message} – ${new Date().toISOString()}   `));
    log(chalk.yellow.bgYellow(`   [NodeMVC]: ${message} – ${new Date().toISOString()}   `));
    log();
  },
  danger(message, clearTerminal = false) {
    if (clearTerminal) clear();
    log(chalk.red(`[NodeMVC]: ${message} – ${new Date().toISOString()}`));
  },
  dangerBanner(message) {
    clear();
    log(chalk.red.bgRed(`   [NodeMVC]: ${message} – ${new Date().toISOString()}   `));
    log(chalk.bgRed.bold(`   [NodeMVC]: ${message} – ${new Date().toISOString()}   `));
    log(chalk.red.bgRed(`   [NodeMVC]: ${message} – ${new Date().toISOString()}   `));
    log();
  },
}
