/**
 * Title:  employee.interface.ts
 * Author: Danial Purselley
 * Date: 17 Jan 23
 * Description: employee interface
 *   for employee object
 */

import { Item } from "./item.interface";

export interface Employee {
  empId: number;
  firstName: string;
  lastName: string;
  todo: Item[];
  done: Item[];
}
