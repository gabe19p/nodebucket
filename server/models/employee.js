/**
 *
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema for the employees collection
let employeeSchema = new Schema(
  {
    empId: { type: Number, unique: true, required: true },
    firstName: { type: String },
    lastName: { type: String },
  },
  { collection: "employees" }
);

// export our schema as a model named "Employee"
module.exports = mongoose.model("Employee", employeeSchema);
