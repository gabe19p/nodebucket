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
}
