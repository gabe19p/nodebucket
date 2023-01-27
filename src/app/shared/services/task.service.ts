/**
 * Title:  task.service.ts
 * Author: Danial Purselley
 * Date: 17 Jan 23
 * Description: http service for
 *   task calls
 */

import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Item } from "../models/item.interface";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  constructor(private http: HttpClient) {}

  // angular service for returning the employees tasks
  findAllTasks(empId: number): Observable<any> {
    // return api get route
    return this.http.get("/api/employees/" + empId + "/tasks");
  }

  // angular service for adding a task to the employee
  createTask(empId: number, task: string): Observable<any> {
    // return api post route, with task param added to 'text'
    return this.http.post("/api/employees/" + empId + "/tasks", {
      text: task,
    });
  }

  // call update api when we move out tasks
  updateTask(empId: number, todo: Item[], done: Item[]): Observable<any> {
    return this.http.put("/api/employees/" + empId + "/tasks", { todo, done });
  }

  // call delete api when we delete tasks
  deleteTask(empId: number, taskId: string): Observable<any> {
    return this.http.delete("/api/employees/" + empId + "/tasks/" + taskId);
  }
}
