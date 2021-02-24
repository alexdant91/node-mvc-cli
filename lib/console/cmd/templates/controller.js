module.exports = `const Models = include("app.core.models");;

class %__MODEL_NAME__%Controller extends Models {
  constructor() {
    super("%__MODEL_NAME__%");
  }

  /* Set all controllers here */
  all = async (req, res, next) => {
    // Set special options
    // It works only for \`findAll\` method
    // E.g. req.saveCache = { save: true, key: "%__MODEL_MIN_NAME__%" };
    // Proceed to query
    // E.g. this.findAll(req, res);
  }

  index = async (req, res, next) => {
    // E.g. this.findById(req, res);
  }

  search = async (req, res, next) => {
    // E.g. this.find(req, res);
  }

  searchOne = async (req, res, next) => {
    // E.g. this.findOne(req, res);
  }

  store = async (req, res, next) => {
    // E.g. this.create(req, res);
  }

  edit = async (req, res, next) => {
    // E.g. this.update(req, res);
  }

  remove = async (req, res, next) => {
    // E.g. this.delete(req, res);
  }
}

module.exports = new %__MODEL_NAME__%Controller();
`
