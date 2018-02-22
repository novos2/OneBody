import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavParams,NavController} from 'ionic-angular';
import {Employee} from "../../models/employee";
import {EmployeeService} from "../../services/employee";
import {AuthService} from "../../services/auth";
import {Response} from "@angular/http";
import {Treatment} from "../../models/treatment";
import {TreatmentService} from "../../services/treatment";
import {EditemployeePage} from "../editemployee/editemployee";
import * as moment from 'moment';
import {Treatments} from "../treatments/treatments";
import {SMS} from "@ionic-native/sms";
import {CallNumber} from "@ionic-native/call-number";

@IonicPage()
@Component({
  selector: 'page-employees',
  templateUrl: 'employees.html',
})
export class Employees implements OnInit {
  flag:boolean;
  listItems: Employee[];
  listTreatments:Treatment[];
  filteredFutureTreatmentList:Treatment[];
  filteredPastTreatmentList:Treatment[];
  employee: Employee;
  filterFutureTreatmentFlag:boolean;
  filterPastTreatmentFlag:boolean;
  myDate= moment().format();
  index: number;


  constructor(public navParams: NavParams,
              private empService: EmployeeService,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navCtrl:NavController,
              private treatmentService:TreatmentService,
              private sms: SMS,
              private call:CallNumber) {
    this.flag=false;

  }
  ngOnInit() {
    this.employee = this.navParams.get('employee');
    this.index = this.navParams.get('index');
    this.loadTreatments();
    /*var user = this.authService.getActiveUser().email;
    if(user=='test@test.com'){
      this.flag=true;
    }
    else {
      this.flag=false;
    }*/
    /*if(this.authService.isAdmin())
      this.flag=true;
    else this.flag=false;*/
  }
  ionViewDidLoad() {
  }
  doRefresh(refresher) {
    this.loadTreatments();
    setTimeout(() => {
      refresher.complete();
    }, 500);
  }
   private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: '!שגיאה',
      message: errorMessage,
      buttons: ['חזרה']
    });
    alert.present();
  }
  onEditEmployee(){
    this.navCtrl.push(EditemployeePage, { employee: this.employee, index: this.index});
  }
  onSendSMSEmployee(){
    let alert = this.alertCtrl.create({
      title: 'שליחת הודעה',
      inputs: [
        {
          name: 'smsText',
          placeholder: 'הודעה'
        }
      ],
      buttons: [
        {
          text: 'ביטול',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'שליחה',
          handler: data => {
            this.sms.send(this.employee.employeePhone,data.smsText);
          }
        }
      ]
    });
    alert.present();
  }
  onCallNumber(){
    this.call.callNumber(this.employee.employeePhone,true);
  }
  private loadList(){
    /*const loading = this.loadingCtrl.create({
     content: '...אנא המתן'
     });
     loading.present();*/
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.empService.fetchList(token)
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
                  this.selectData(this.employee.employeeName);
                  this.selectPastData(this.employee.employeeName);
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
  searchPastPatients(ev: any) {

    // set val to the value of the searchbar
    let val = ev.target.value;
    // Reset items back to all of the items
    if(val.trim()=='') {
      this.loadTreatments();
      this.selectPastData(this.employee.employeeName);
    }
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.filteredPastTreatmentList = this.filteredPastTreatmentList.filter((item) => {
        return (item.patientName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  onLoadTreatment(treatment: Treatment, index: number) {
    this.navCtrl.push(Treatments, {treatment: treatment, index: index});
  }
  searchFuturePatients(ev: any) {

    // set val to the value of the searchbar
    let val = ev.target.value;
    // Reset items back to all of the items
    if(val.trim()=='') {
      this.loadTreatments();
      this.selectData(this.employee.employeeName);
    }
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.filteredFutureTreatmentList = this.filteredFutureTreatmentList.filter((item) => {
        return (item.patientName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  selectData(empName:string){
    this.filteredFutureTreatmentList=this.listTreatments.filter(obj=> obj.employeeName==empName&&obj.treatmentStartDate.slice(0,10)>=this.myDate.slice(0,10)).sort((tr1,tr2)=>{
      let date1=tr1.treatmentStartDate.slice(0,16);
      let date2 = tr2.treatmentStartDate.slice(0,16);
      if(date1<date2)
        return -1;
      else if(date1==date2){
        return 0;
      }
      else{
        return 1;
      }
    });
    if(this.filteredFutureTreatmentList.length>0){
      this.filterFutureTreatmentFlag=true;
    }
  }
  selectPastData(empName:string){
    this.filteredPastTreatmentList=this.listTreatments.filter(obj=> obj.employeeName==empName&&obj.treatmentStartDate.slice(0,10)<this.myDate.slice(0,10)).sort((tr1,tr2)=>{
      let date1=tr1.treatmentStartDate.slice(0,16);
      let date2 = tr2.treatmentStartDate.slice(0,16);
      if(date1<date2)
        return 1;
      else if(date1==date2){
        return 0;
      }
      else{
        return -1;
      }
    });
    if(this.filteredPastTreatmentList.length>0){
      this.filterPastTreatmentFlag=true;
    }
  }
  private saveList(){
    const loading = this.loadingCtrl.create({
      content: '...אנא המתן'
    });
    loading.present();
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.empService.storeList(token)
            .subscribe(
              () => loading.dismiss(),
              error => {
                loading.dismiss();
                this.handleError(error.json().error);
              }
            );
        }
      );
  }
  private successWindow(success:string){
    const alert = this.alertCtrl.create({
      message: success,
      buttons: ['חזרה']
    });
    alert.present();
  }
  private isAdmin(){
    return this.authService.isAdmin;
  }
}
