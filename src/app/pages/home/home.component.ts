/**
 * Title:  home.component.ts
 * Author: Danial Purselley
 * Date: 17 Jan 23
 * Description: angular homepage
 */

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import * as e from "express";
import { CookieService } from "ngx-cookie-service";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { DialogData } from "src/app/shared/models/dialog-data.interface";
import { Employee } from "src/app/shared/models/employee.interface";
import { Item } from "src/app/shared/models/item.interface";
import { TaskService } from "src/app/shared/services/task.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  // employee interface
  employee: Employee;
  // item interfaces
  todo: Item[];
  done: Item[];

  // empId variable to grab session user
  empId: number;

  dialogData: DialogData;

  // add validation to task item
  taskForm: FormGroup = this.fb.group({
    task: [
      null,
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(35),
      ]),
    ],
  });

  constructor(
    private taskService: TaskService,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    //initialize above variables
    this.employee = {} as Employee;
    this.dialogData = {} as DialogData;
    this.todo = [];
    this.done = [];
    this.empId = parseInt(this.cookieService.get("session_user"), 10);

    /**
     * subscribe will listen to the findAll function and return a res
     * we set this.employee (variable) as the res data from the DB
     * then set the todo and done arrays as the employee.todo/done
     * to populate the UI with the DB data
     */
    this.taskService.findAllTasks(this.empId).subscribe({
      next: (res) => {
        /**
         * return the response from API call (which calls the DB)
         */
        this.employee = res;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        // setting arrays to employee res arrays
        this.todo = this.employee.todo;
        this.done = this.employee.done;

        // verify task information
        console.log(this.todo);
        console.log(this.done);
      },
    });
  } // end constructor

  ngOnInit(): void {}

  createTask() {
    const newTask = this.taskForm.controls["task"].value;

    this.taskService.createTask(this.empId, newTask).subscribe({
      next: (res) => {
        this.employee = res;
        console.log("-- this is the response from the createTask");
        console.log(res);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.todo = this.employee.todo;
        this.done = this.employee.done;

        console.log("-- onComplete method");
        console.log(this.todo);
        console.log(this.done);

        this.taskForm.controls["task"].setErrors({ incorrect: false });
      },
    });
  }

  // populate the delete dialog
  deleteTask(taskId: string) {
    this.dialogData.header = "Delete Record Dialog";
    this.dialogData.content = "Are you sure you want to delete this task?";
    // open a mat dialog, with our confirm component, passing in data to populate the card
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        // result comes from matDialogClose action
        console.log(result);
        // if confirmed, call deleteTask w/ subscription
        if (result === "confirm") {
          this.taskService.deleteTask(this.empId, taskId).subscribe({
            next: (res) => {
              this.employee = res;
            },
            error: (e) => {
              console.log(e);
            },
            complete: () => {
              this.todo = this.employee.todo;
              this.done = this.employee.done;
            },
          });
        }
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  // move the tasks
  drop(event: CdkDragDrop<any[]>) {
    // check to see if moved within same array
    if (event.previousContainer === event.container) {
      console.log("Item reordered in the same column");
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // API Call
      this.updateTaskList(this.empId, this.todo, this.done);
    } else {
      console.log("Item moved to new column");
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // API Call
      this.updateTaskList(this.empId, this.todo, this.done);
    }
  } // end drop

  // update task to call API since we will reuse this multiple times
  updateTaskList(empId: number, todo: Item[], done: Item[]) {
    this.taskService.updateTask(empId, todo, done).subscribe({
      next: (res) => {
        this.employee = res;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.todo = this.employee.todo;
        this.done = this.employee.done;
      },
    });
  }
}
