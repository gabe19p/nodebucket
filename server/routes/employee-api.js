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
    res.status(500).send({ err: config.serverError + ": " + error.message });
  }
});

/**
 * updateTasks
 * @openapi
 * /api/employees/{empId}/tasks:
 *   put:
 *     tags:
 *       - Employees
 *     description: API for updating a task
 *     summary: update tasks from employee
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
 *              properties:
 *                todo:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      text:
 *                        type: string
 *                done:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      text:
 *                        type: string
 *     responses:
 *       '200':
 *         description: Updated Employee document
 *       '401':
 *         description: Invalid employeeId
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
 */
router.put("/:empId/tasks", async (req, res) => {
  try {
    Employee.findOne({ empId: req.params.empId }, function (err, emp) {
      // if there is an error within MongoDB
      if (err) {
        console.log(err);
        res.status(501).send({
          err: "MongoDB server error: " + err.message,
        });
      }
      // found employee
      else {
        if (emp) {
          console.log(emp);

          // setting the body data to fields
          emp.set({
            todo: req.body.todo,
            done: req.body.done,
          });

          // save the updatedEmp
          emp.save(function (err, updatedEmp) {
            if (err) {
              console.log(err);
              res.status(501).send({
                err: "MongoDB server error: " + err.message,
              });
            } else {
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
  } catch (e) {
    // catching the server error
    console.log(e);
    res.status(500).send({ err: config.serverError + ": " + e.message });
  }
});

/**
 * deleteTask
 * @openapi
 * /api/employees/{empId}/tasks/{taskId}:
 *   delete:
 *     tags:
 *       - Employees
 *     description: API for deleting a task
 *     summary: delete employee task
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: employee id
 *         schema:
 *           type: number
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: task id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Task deleted
 *       '401':
 *         description: Invalid employee Id
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
 */
router.delete("/:empId/tasks/:taskId", async (req, res) => {
  try {
    Employee.findOne({ empId: req.params.empId }, function (err, emp) {
      /**
       * callback error, handling mongoDB search
       */
      if (err) {
        console.log(err);
        res.status(501).send({
          err: "MongoDB server error: " + err.message,
        });
      } else {
        /**
         * if statement to see if employee exists within the DB
         */
        if (emp) {
          /**
           * task variables from the request
           */
          const taskId = req.params.taskId;
          const todoItem = emp.todo.find(
            (item) => item._id.toString() === taskId
          );
          const doneItem = emp.done.find(
            (item) => item._id.toString() === taskId
          );
          /**
           * updated the todo array
           */
          if (todoItem) {
            /**
             * remove the array item from DB
             */
            emp.todo.id(todoItem._id).remove();
            /**
             * save the removal w/ callback
             */
            emp.save(function (err, updatedTodoItem) {
              if (err) {
                console.log(err);
                res.status(501).send({
                  err: "MongoDB server error: " + err.message,
                });
              } else {
                console.log(updatedTodoItem); // API SUCCESS!
                res.json(updatedTodoItem);
              }
            }); // end emp.save
          } else if (doneItem) {
            /**
             * update the done array
             */
            emp.done.id(doneItem._id).remove();
            /**
             * save the removal w/ callback
             */
            emp.save(function (err, updatedDoneItem) {
              if (err) {
                console.log(err);
                res.status(501).send({
                  err: "MongoDB server error: " + err.message,
                });
              } else {
                console.log(updatedDoneItem); // API SUCCESS!
                res.json(updatedDoneItem);
              }
            }); // end emp.save
          } else {
            console.log("Invalid taskId: " + taskId);
            res.status(401).send({
              err: "Invalid taskId: " + taskId,
            });
          }
        } else {
          /**
           * handle error if employee doesn't exist in DB
           */
          res.status(401).send({
            err:
              "Employee ID: " +
              req.params.empId +
              " does not belong to a registered user.",
          });
        }
      } //  end else of callback
    }); // end findOne
  } catch (e) {
    // catching the server error
    console.log(e);
    res.status(500).send({ err: config.serverError + ": " + e.message });
  }
});

module.exports = router;
