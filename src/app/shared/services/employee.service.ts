import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  // method to find the emp id
  findEmployeeById(empId: number): Observable<any> {
    // return the get route to the server api
    return this.http.get("/api/employees/" + empId);
  }
}
