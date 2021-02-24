module.exports.Imports = `const mongoose = require('mongoose');
const Schema = mongoose.Schema;`

module.exports.PartialSchema = `
const %__MODEL_NAME__%Model = require('../../../database/models/%__MODEL_NAME__%');
const %__MODEL_NAME__%Schema = new Schema(%__MODEL_NAME__%Model(mongoose.Schema.Types));
`

module.exports.PartialExportsExport = `module.exports = [%__PARTIAL_EXPORTS__%
]`;

module.exports.PartialExports = `
  {
    name: "%__MODEL_NAME__%",
    schema: %__MODEL_NAME__%Schema
  },`

module.exports.SchemasTemplate = `%__IMPORTS__%
%__SCHEMAS__%
%__PARTIAL__%
`;
