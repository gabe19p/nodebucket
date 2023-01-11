/**
 * Require statements
 */
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const swaggerUI = require("swagger-ui-express");
const swaggerJSdoc = require("swagger-jsdoc");
const EmployeeAPI = require("./routes/employee-api");

const app = express(); // Express variable.

/**
 * App configurations.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/nodebucket")));
app.use("/", express.static(path.join(__dirname, "../dist/nodebucket")));

// default server port value.
const PORT = process.env.PORT || 3000;

// TODO: This line will be replaced with your database connection string (including username/password).
const CONN =
  "mongodb+srv://nodebucket_user:s3cret@buwebdev-cluster-1.078ar.mongodb.net/nodebucket?retryWrites=true&w=majority";

/**
 * Database connection.
 */
mongoose
  .connect(CONN)
  .then(() => {
    console.log("Connection to the database was successful");
  })
  .catch((err) => {
    console.log("MongoDB Error: " + err.message);
  });

/**
 * Swagger Setup
 */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WEB 450 MEAN Stack",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], // files containing swagger
};

const openapiSpecification = swaggerJSdoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(openapiSpecification));

/**
 * API paths here
 */
app.use("/api/employees", EmployeeAPI);

// Wire-up the Express server.
app.listen(PORT, () => {
  console.log("Application started and listening on PORT: " + PORT);
});