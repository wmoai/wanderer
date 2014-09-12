var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
;

var schema = new Schema({
  name: String,
  session_id: String
});

module.exports = mongoose.model('session', schema);
