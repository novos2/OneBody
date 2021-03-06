import {Component} from '@angular/core';
import {AlertController,NavController} from 'ionic-angular';
import * as moment from 'moment';
import {Treatment} from "../../models/treatment";
import {TreatmentService} from "../../services/treatment";
import {Treatments} from "../treatments/treatments";
import {AuthService} from "../../services/auth";
import {EmployeeService} from "../../services/employee";

@Component({
  selector: 'page-homescreen',
  templateUrl: 'homescreen.html',
})
export class Homescreen{
  myDate= moment().format();
  today:string;
  notes:boolean;
  listEmpty:boolean;
  filterTreatmentFlag:boolean;
  user:string;
  flagIsAdmin:boolean;
  listTreatments:Treatment[];
  filteredTreatmentList: Treatment[];
  constructor(private alertCtrl: AlertController,private treatmentService:TreatmentService,
              private navCtrl:NavController,
              private authService:AuthService,
              private empService:EmployeeService) {
    this.notes=false;
    this.filterTreatmentFlag=false;
    this.today=moment().format();
     this.user = this.authService.getActiveUser().email;
    if(this.user=='test@test.com'){
      this.flagIsAdmin=true;
    }
    else {
      this.flagIsAdmin=false;
    }
  }



  ionViewDidLoad(){
    this.loadTreatments();

  }
  doRefresh(refresher) {
    this.loadTreatments();
    setTimeout(() => {
      refresher.complete();
    }, 500);
  }
  selectData(date: string){
    let modifiedDate = date.slice(0,10);
    if(this.flagIsAdmin) {
      this.filteredTreatmentList = this.listTreatments.filter(obj => obj.treatmentStartDate.slice(0, 10) == modifiedDate).sort((tr1, tr2) => {
        let date1 = tr1.treatmentStartDate.slice(11, 16);
        let date2 = tr2.treatmentStartDate.slice(11, 16);
        if (date1 < date2)
          return -1;
        else if (date1 == date2) {
          return 0;
        }
        else {
          return 1;
        }
      });
      if (this.filteredTreatmentList.length == 0) {
        this.listEmpty = true;
      }
      else{
        this.listEmpty=false;
      }
      this.filterTreatmentFlag = true;
    }
    else{
      this.filteredTreatmentList = this.listTreatments.filter(obj => obj.treatmentStartDate.slice(0, 10) == modifiedDate && this.empService.findEmpNameByFireBaseMail(obj.employeeName)).sort((tr1, tr2) => {
        let date1 = tr1.treatmentStartDate.slice(11, 16);
        let date2 = tr2.treatmentStartDate.slice(11, 16);
        if (date1 < date2)
          return -1;
        else if (date1 == date2) {
          return 0;
        }
        else {
          return 1;
        }
      });
      if (this.filteredTreatmentList.length == 0) {
        this.listEmpty = true;
      }
      else{
        this.listEmpty=false;
      }
      this.filterTreatmentFlag = true;
    }
  }
  zeroDay(){
    this.myDate= moment().format();
    this.loadTreatments();
  }
  onLoadTreatment(treatment: Treatment, index: number) {
    this.navCtrl.push(Treatments, {treatment: treatment, index: index});
  }
  private loadTreatments(){
    /*const loading = this.loadingCtrl.create({
      content: '...אנא המתן'
    });
    loading.present();*/
    this.treatmentService.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.treatmentService.fetchList(token)
            .subscribe(
              (list: Treatment[]) => {
                //loading.dismiss();
                if (list) {
                  this.listTreatments = list;
                  this.selectData(this.myDate);
                } else {
                  this.listTreatments = [];
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
  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: '!שגיאה',
      message: errorMessage,
      buttons: ['חזרה']
    });
    alert.present();
  }
  private isAdmin(){
    return this.authService.isAdmin;
  }
}
