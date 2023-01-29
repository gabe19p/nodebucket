/**
 * Title:  confirm-dialog.component.ts
 * Author: Danial Purselley
 * Date: 17 Jan 23
 * Description: angular homepage
 */

import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { DialogData } from "../models/dialog-data.interface";

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.css"],
})
export class ConfirmDialogComponent implements OnInit {
  // create reusable dialog variable
  dialogData: DialogData;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    // this data comes from the home.component.ts file, using the @Inject above
    this.dialogData = data;
    console.log(this.dialogData);
  }

  ngOnInit(): void {}
}
