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
const config = require("../data/config.json");
// import our employee model
const Employee = require("../models/employee");

/**
 * findEmployeeById
 * @openapi
 * /api/employees/{empId}:
 *   get:
 *     tags:
 *       - Employees
 *     description:  API for returning employees by employeeId
 *     summary: returns employee by employeeId
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: Employees ID
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Employee document
 *       '401':
 *         description: Invalid employeeId
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
 */
router.get("/:empId", async (req, res) => {
  try {
    // call Employee model with the params f/ mongo
    Employee.findOne({ empId: req.params.empId }, function (err, emp) {
      // if mongo error console issue
      if (err) {
        console.log(err);
        res.status(501).send({
          err: config.mongoServerError + ": " + err.message,
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

/**
 * findAllTasks
 * @openapi
 * /api/employees/{empId}/tasks:
 *   get:
 *     tags:
 *       - Employees
 *     description: API for returning all of an employees tasks
 *     summary: return employee tasks
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Employee document
 *       '401':
 *         description: Invalid employeeId
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
 */
router.get("/:empId/tasks", async (req, res) => {
  // find the employee based on params employee ID
  try {
    Employee.findOne(
      {
        empId: req.params.empId,
      },
      "empId todo done",
      function (err, emp) {
        // mongodb error when finding emp in callback
        if (err) {
          console.log(err);
          res.status(501).send({
            err: config.mongoServerError + ": " + err.message,
          });
        } // return the found emp json item
        else {
          console.log(emp);
          res.json(emp);
        }
      }
    );
  } catch (error) {
    // catching the server error
    console.log(error);
    res.status(500).send({ err: config.serverError + ": " + e.message });
  }
});

/**
 * createTask
 * @openapi
 * /api/employees/{empId}/tasks:
 *   post:
 *     tags:
 *       - Employees
 *     description: API for creating a new task
 *     summary: push task to the todo array
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: employee id
 *         schema:
 *           type: number
 *     requestBody:
 *        description:
 *        content:
 *          application/json:
 *            schema:
 *              required:
 *                - text
 *              properties:
 *                text:
 *                  type: string
 *     responses:
 *       '200':
 *         description: Employee document
 *       '401':
 *         description: Invalid employeeId
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
 */
router.post("/:empId/tasks", async (req, res) => {
  // find employee with params id
  try {
    Employee.findOne({ empId: req.params.empId }, function (err, emp) {
      // throw an error if mongodb issue
      if (err) {
        console.log(err);
        res.status(501).send({
          err: config.mongoServerError + ": " + err.message,
        });
      }
      // if no error, proceed with found employee
      else {
        // if employee is found, add task
        if (emp) {
          console.log(emp);
          // task variable based on the parameters text
          const newTask = {
            text: req.body.text,
          };
          // push the new task to the todo array
          emp.todo.push(newTask);
          // save the new emp object with task
          emp.save(function (err, updatedEmp) {
            // if there is an issue saving, handle error
            if (err) {
              console.log(err);
              res.status(501).send({
                err: config.mongoServerError + ": " + err.message,
              });
            }
            // if no issue saving, update employee todo array and console object
            else {
              console.log(updatedEmp);
              res.json(updatedEmp);
            }
          });
        }
        // if emp is null / employee doesn't exist, handle error
        else {
          res.status(401).send({
            err:
              "Employee ID: " +
              req.params.empId +
              " does not belong to a registered user.",
          });
        }
      }
    });
  } catch (error) {
    // catching the server error
    console.log(error);
    res.status(500).send({ err: config.serverError + ": " + e.message });
  }
});

module.exports = router;
