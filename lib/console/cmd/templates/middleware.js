module.exports = `const Middleware = include('app.core.middleware.Auth');
const Database = include('app.core.database');

class %__MODEL_NAME__% extends Middleware {
  constructor() {
    super();
    this.db = new Database("[MODEL_SCHEMA_NAME_HERE]") // Replace with schema name to get all Database methods
    // this.models = Database.get("models"); -> You can statically get db schemas to manually manipulate them

    /**
     * You can statically get db schemas to manually manipulate them:
     *
     * (async () => {
     *   const myItem = await this.models.find({ _id }, null, { lean: true });
     *   if (myItem.length > 0) {
     *     ...
     *   }
     * })();
     */
  }

  myMiddlFn = (req, res, next) => {
    // Pass your middleware here
    // return this.verifyToken(req, res, next); -> Middleware class utility function
  }

  // Write as many middleware function as needed ;)

}

module.exports = new %__MODEL_NAME__%();
`;
