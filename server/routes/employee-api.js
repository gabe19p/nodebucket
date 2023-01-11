/*
============================================
; Title:  employee-api.js
; Author: Danial Purselley
; Date:   10 Jan 23
; Description: route for employee API
;===========================================
*/

const express = require("express");
const router = express.Router();
// import our employee model
const Employee = require("../models/employee");

/**
 * findEmployeeById
 * @openapi
 *   get:
 *     tags: employee
 *     description:
 *     summary:
 *     responses:
 *       '200':
 *         description:
 *       '500':
 *         description:
 *       '501':
 *         description:
 */
router.get("/:empId", async (req, res) => {
  try {
    // call Employee model with the params f/ mongo
    Employee.findOne({ empId: req.params.empId }, function (err, emp) {
      // if mongo error console issue
      if (err) {
        console.log(err);
        res.status(501).send({
          err: "MongoDB server error: " + err.message,
        });
      }
      // if no error, return found emp as json
      else {
        console.log(emp);
        res.json(emp);
      }
    });
  } catch (error) {
    // catch the internal server error
    console.log(error);
    res.status(500).send({ err: "Internal server error!" });
  }
});

module.exports = router;
