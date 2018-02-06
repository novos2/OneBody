import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';
import {Employee} from "../models/employee";
import { AuthService } from "./auth";

@Injectable()
export class EmployeeService {
  private employees: Employee[] = [];

  constructor(private http: Http, private authService: AuthService) {
  }

  addItem(employeeID: number,employeeFirstName: string,employeeLastName: string,employeePhone: string,employeeGender:string,employeeMail: string,employeeDOB: Date) {
    this.employees.push(new Employee(employeeID,employeeFirstName,employeeLastName,employeePhone,employeeGender,employeeMail,employeeDOB));
    console.log(this.employees);
  }

  addItems(items: Employee[]) {
    this.employees.push(...items);
  }

  getItems() {

    return this.employees.slice();
  }

  removeItem(index: number) {
    this.employees.splice(index, 1);
  }

  storeList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http
      .put('https://onebody-356cf.firebaseio.com/employee.json?auth=' + token, this.employees)
      .map((response: Response) => {
        return response.json();
      });
  }

  fetchList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.get('https://onebody-356cf.firebaseio.com/employee.json?auth=' + token)
      .map((response: Response) => {
        return response.json();
      })
      .do((employees: Employee[]) => {
        if (employees) {
          this.employees = employees;
        } else {
          this.employees = [];
        }
      });
  }

   checkIfExists(list:Employee[],x:number){
    for(let n of list){
      if(x==n.employeeID)
        return true;
    }
    return false;
  }
}
