/**
 * Title:  employee.js
 * Author: Danial Purselley
 * Date: 17 Jan 23
 * Description: employee model
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const itemSchema = require("./item");

// schema for the employees collection
let employeeSchema = new Schema(
  {
    empId: { type: Number, unique: true, required: true },
    firstName: { type: String },
    lastName: { type: String },
    todo: [itemSchema],
    done: [itemSchema],
  },
  { collection: "employees" }
);

// export our schema as a model named "Employee"
module.exports = mongoose.model("Employee", employeeSchema);
