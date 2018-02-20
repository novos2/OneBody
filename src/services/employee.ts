import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';
import {Employee} from "../models/employee";
import { AuthService } from "./auth";
import {AlertController} from "ionic-angular";

@Injectable()
export class EmployeeService {
  private employees: Employee[] = [];
   listItems: Employee[];
  userMail:string;
  constructor(private http: Http, private authService: AuthService,private alertCtrl:AlertController) {
    this.userMail = this.authService.getActiveUser().email;
    this.loadEmp();
  }

  addItem(employeeID: number,employeeName: string,employeePhone: string,employeeGender:string,employeeMail: string,employeeDOB: Date) {
    this.employees.push(new Employee(employeeID,employeeName,employeePhone,employeeGender,employeeMail,employeeDOB));
    console.log(this.employees);
  }
  updateEmployee(index:number, employeeID:number, employeeName:string, employeePhone:string, employeeGender:string,employeeMail:string, employeeDOB: Date){
    this.employees[index] = new Employee(employeeID,employeeName,employeePhone,employeeGender,employeeMail,employeeDOB);
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
    getEmpIDByName(empName:string){
      this.authService.getActiveUser().getToken()
        .then(
          (token: string) => {
            this.fetchList(token)
              .subscribe(
                (list: Employee[]) => {
                  //loading.dismiss();
                  if (list) {
                    this.listItems = list;
                  } else {
                    this.listItems = [];
                  }
                },
                error => {
                  //loading.dismiss();
                  this.handleError(error.json().error);
                }
              );
          }
        );
      for(let n of this.listItems){
        if(empName==n.employeeName){
          return n.employeeID;
        }
      }
    }
    getEmpNameByID(empID:string){
      this.authService.getActiveUser().getToken()
        .then(
          (token: string) => {
            this.fetchList(token)
              .subscribe(
                (list: Employee[]) => {
                  //loading.dismiss();
                  if (list) {
                    this.listItems = list;
                  } else {
                    this.listItems = [];
                  }
                },
                error => {
                  //loading.dismiss();
                  this.handleError(error.json().error);
                }
              );
          }
        );
      for(let n of this.listItems){
        if(empID.toString()==n.employeeID.toString()){
          return n.employeeName;
        }
      }
    }
      findEmpNameByFireBaseMail(empName:string){
      for(let n of this.listItems){
        if(n.employeeMail==this.userMail&&n.employeeName==empName)
        {
          return true;
        }
      }
      return false;
    }
    loadEmp(){
      this.authService.getActiveUser().getToken()
        .then(
          (token: string) => {
            this.fetchList(token)
              .subscribe(
                (list: Employee[]) => {
                  //loading.dismiss();
                  if (list) {
                    this.listItems = list;
                  } else {
                    this.listItems = [];
                  }
                },
                error => {
                  //loading.dismiss();
                  this.handleError(error.json().error);
                }
              );
          }
        );
    }
   checkIfExists(list:Employee[],x:number){
    for(let n of list){
      if(x==n.employeeID)
        return true;
    }
    return false;
  }
  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: '!שגיאה',
      message: errorMessage,
      buttons: ['חזרה']
    });
    alert.present();
  }
}
