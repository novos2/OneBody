import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';
import {Patient} from "../models/patient";
import { AuthService } from "./auth";
import {Employee} from "../models/employee";
import {Treatment} from "../models/treatment";
import firebase from "firebase";
import {EmployeeService} from "./employee";
import {AlertController} from "ionic-angular";
import {PatientService} from "./patient";

@Injectable()
export class TreatmentService {
  private treatments: Treatment[] = [];
  private patients: Patient[];

  constructor(private http: Http, private authService: AuthService, private empService: EmployeeService, private alertCtrl: AlertController, private patientService: PatientService) {
  }

  addItem(treatmentType: string, employeeName: string, patientName: string, treatmentStartDate: string, treatmentEndDate: string, treatmentRoom: string, notes: string) {
    this.treatments.push(new Treatment(treatmentType, employeeName, patientName, treatmentStartDate, treatmentEndDate, treatmentRoom, notes));
    console.log(this.treatments);
  }

  updateTreatment(index: number, treatmentType: string, employeeName: string, patientName: string, treatmentStartDate: string, treatmentEndDate: string, treatmentRoom: string, notes: string) {
    this.treatments[index] = new Treatment(treatmentType, employeeName, patientName, treatmentStartDate, treatmentEndDate, treatmentRoom, notes);
  }

  addItems(items: Treatment[]) {
    this.treatments.push(...items);
  }

  getActiveUser() {
    return firebase.auth().currentUser;
  }

  getItems() {

    return this.treatments.slice();
  }

  removeItem(index: number) {
    this.treatments.splice(index, 1);
  }

  storeList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http
      .put('https://onebody-356cf.firebaseio.com/treatment.json?auth=' + token, this.treatments)
      .map((response: Response) => {
        return response.json();
      });
  }

  private loadList() {
    /*const loading = this.loadingCtrl.create({
     content: '...אנא המתן'
     });
     loading.present();*/
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.fetchList(token)
            .subscribe(
              (list: Treatment[]) => {
                //loading.dismiss();
                if (list) {
                  this.treatments = list;
                } else {
                  this.treatments = [];
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

  fetchList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.get('https://onebody-356cf.firebaseio.com/treatment.json?auth=' + token)
      .map((response: Response) => {
        return response.json();
      })
      .do((treatments: Treatment[]) => {
        if (treatments) {
          this.treatments = treatments;
        } else {
          this.treatments = [];
        }
      });
  }

  checkIfStartDateEarlierThanEndDate(startDate: string, endDate: string) {
    return startDate == endDate;
  }

  checkIfHourDateEarierIsValid(h1: string, h2: string) {
    return h1 < h2;
  }

  checkIfEmployeeIsntOccupiedDuringThisTime(list: Treatment[], empName: string, startDate: string, h1: string, h2: string) {
    for (let n of list) {
      if (n.treatmentStartDate.slice(0, 10) == startDate) {
        if (n.employeeName == empName) {
          console.log("n.treatmentEndDate is: " + n.treatmentEndDate.slice(11, 16) + " start date of current treatment is " + h1 + " end date of current treatment is: " + h2);
          if (!((h1 < n.treatmentStartDate.slice(11, 16) && h2 <= n.treatmentStartDate.slice(11, 16)) || (h1 >= n.treatmentEndDate.slice(11, 16) && h2 > n.treatmentEndDate.slice(11, 16)))) {
            return false;
          }
        }
      }
    }
    return true;
  }

  checkForEditTreatmentIfEmployeeIsntOccupiedDuringThisTime(list:Treatment[],empName:string,patientName:string,startDate:string,h1:string,h2:string) {
    for (let n of list) {
      if (n.treatmentStartDate.slice(0, 10) == startDate) {
        if (n.employeeName == empName) {
          if(n.patientName==patientName){
            return true;
          }
          if (!((h1 < n.treatmentStartDate.slice(11, 16) && h2 <= n.treatmentStartDate.slice(11, 16)) || (h1 >= n.treatmentEndDate.slice(11, 16) && h2 > n.treatmentEndDate.slice(11, 16)))) {
            return false;
          }
        }
      }
    }
    return true;
  }
  checkIfRoomIsAvailableDuringThisTime(list:Treatment[],startDate:string,h1:string,h2:string,roomNumber:string){
    for(let n of list){
      if(n.treatmentStartDate.slice(0,10)==startDate){
        if(!((h1<n.treatmentStartDate.slice(11,16)&&h2<=n.treatmentStartDate.slice(11,16))||(h1>=n.treatmentEndDate.slice(11,16)&&h2>n.treatmentEndDate.slice(11,16)))){
          if(n.treatmentRoom==roomNumber){
            return false;
          }
        }
      }
    }
    return true;
  }
  checkForEditIfRoomIsAvailableDuringThisTime(list:Treatment[],empName:string,patientName:string,startDate:string,h1:string,h2:string,roomNumber:string){
    for(let n of list){
      if(n.treatmentStartDate.slice(0,10)==startDate){
        if(!((h1<n.treatmentStartDate.slice(11,16)&&h2<=n.treatmentStartDate.slice(11,16))||(h1>=n.treatmentEndDate.slice(11,16)&&h2>n.treatmentEndDate.slice(11,16)))){
          if(n.treatmentRoom==roomNumber){
            if(n.employeeName==empName&&n.patientName==patientName){
              return true;
            }
            else {
              return false;
            }
          }
        }
      }
    }
    return true;
  }
  getPhoneByName(patientName:string):string{
    this.patients=this.patientService.getItems();
    for(let n of this.patients){
      if(n.patientName==patientName){
        return n.patientPhone.toString();
      }
    }
    return patientName;
  }
  private amountTreatmentPerEmployee(treatmentList:Treatment[],emp:string,wantedDate:string){
    let count=0;
    let dateOfMonth=wantedDate.slice(0,7);
    for(let n of treatmentList){
      if(n.employeeName==emp){
        if(n.treatmentStartDate.slice(0,7)==dateOfMonth){
          count++;
        }
      }
    }
    return count;
  }

  private amountTreatmentPerPatient(treatmentList:Treatment[],patient:string,wantedDate:string){
    let count=0;
    let dateOfMonth=wantedDate.slice(0,7);
    for(let n of treatmentList){
      if(n.patientName==patient){
        if(n.treatmentStartDate.slice(0,7)==dateOfMonth){
          count++;
        }
      }
    }
    return count;
  }

  getIndexByName(empName:string,patientName:string,dateOfTreatment:string){
    this.loadList();
    let count=0;
    for(let n of this.treatments){
      if(n.employeeName==empName&&n.patientName==patientName&&n.treatmentStartDate==dateOfTreatment){
        return count;
      }
      count++;
    }
  }
  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: '!שגיאה',
      message: errorMessage,
      buttons: ['חזרה']
    });
    alert.present();
  }

  /*reportA(listTreatment:Treatment[]){
    let categories:any[]=[];
    var xAxis={categories};
    for (var i in listTreatment) {
      console.log(listTreatment[i])
      xAxis.categories[i].push(listTreatment[i].employeeName);
    }
    return xAxis;
  }*/
  /*checkIfExists(list:Treatment[],x:number){
    for(let n of list){
      if(x==n.patientID)
        return true;
    }
    return false;
  }*/

}

