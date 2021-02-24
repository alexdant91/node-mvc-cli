module.exports = `class %__MODEL_NAME__%Controller {
  /* Set all controllers here */
  all = async (req, res, next) => {
    // Set special options
    // It works only for \`findAll\` method
    // E.g. req.saveCache = { save: true, key: "%__MODEL_MIN_NAME__%" };
    // Proceed to query
    // E.g. this.findAll(req, res);
  }

  index = async (req, res, next) => {
    /* ... */
  }

  search = async (req, res, next) => {
    /* ... */
  }

  searchOne = async (req, res, next) => {
    /* ... */
  }

  store = async (req, res, next) => {
    /* ... */
  }

  edit = async (req, res, next) => {
    /* ... */
  }

  remove = async (req, res, next) => {
    /* ... */
  }
}

module.exports = new %__MODEL_NAME__%Controller();
`
