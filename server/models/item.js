/**
 *
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema for the items
let itemSchema = new Schema({
  text: { type: String },
});

// export our schema as a model named "Employee"
module.exports = itemSchema;
