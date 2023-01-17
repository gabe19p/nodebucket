/**
 * Title:  login.component.ts
 * Author: Danial Purselley
 * Date: 17 Jan 23
 * Description: angular login page
 */

import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Message } from "primeng/api";
import { Employee } from "src/app/shared/models/employee.interface";
import { EmployeeService } from "../../shared/services/employee.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  // empty prime ng error
  errorMessages: Message[] = [];
  employee: Employee;

  // form builder to add validation to empid field
  loginForm: FormGroup = this.fb.group({
    empId: [
      null,
      Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")]),
    ],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private http: HttpClient,
    private employeeService: EmployeeService
  ) {
    this.employee = {} as Employee;
  }

  ngOnInit(): void {}

  login() {
    const empId = this.loginForm.controls["empId"].value;

    this.employeeService.findEmployeeById(empId).subscribe({
      next: (res) => {
        if (res) {
          // employee variable we created
          this.employee = res;
          // add user to the cookies session
          this.cookieService.set(
            "session_user",
            this.employee.empId.toString(), // have to convert to string since empId is a number
            1
          );
          this.cookieService.set(
            "session_user",
            `${this.employee.firstName} ${this.employee.lastName}`,
            1
          );
          this.router.navigate(["/"]);
        } else {
          this.errorMessages = [
            {
              severity: "error",
              summary: "Error",
              detail: "Please enter a valid employeeId to continue.",
            },
          ];
        }
      },
      error: (e) => {
        console.log(e);
        this.errorMessages = [
          { severity: "error", summary: "Error", detail: e.message },
        ];
      },
    });
  }
}
