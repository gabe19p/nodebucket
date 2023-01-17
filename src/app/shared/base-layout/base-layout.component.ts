/**
 * Title:  base-layout.component.ts
 * Author: Danial Purselley
 * Date: 17 Jan 23
 * Description: angular layout f/
 *   nav bar and footer
 */

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-base-layout",
  templateUrl: "./base-layout.component.html",
  styleUrls: ["./base-layout.component.css"],
})
export class BaseLayoutComponent implements OnInit {
  year: number = Date.now();

  constructor(private cookieService: CookieService, private router: Router) {}

  ngOnInit(): void {}

  // log users out and reset all cookies
  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(["/session/login"]);
  }
}
