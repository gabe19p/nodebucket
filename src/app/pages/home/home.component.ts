/**
 * Title:  home.component.ts
 * Author: Danial Purselley
 * Date: 17 Jan 23
 * Description: angular homepage
 */

import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
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
    private fb: FormBuilder
  ) {
    this.employee = {} as Employee;
    this.todo = [];
    this.done = [];
    this.empId = parseInt(this.cookieService.get("session_user"), 10);

    this.taskService.findAllTasks(this.empId).subscribe({
      next: (res) => {
        // return res from API
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
}
