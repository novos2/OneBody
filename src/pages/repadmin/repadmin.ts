import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from "ionic-angular";
import {NgForm} from "@angular/forms";
import {Patient} from "../../models/patient";
import {PatientService} from "../../services/patient";
import {AuthService} from "../../services/auth";
import { SMS } from '@ionic-native/sms';
import {EmployeeService} from "../../services/employee";
import {Employee} from "../../models/employee";
import {Treatment} from "../../models/treatment";
import {TreatmentService} from "../../services/treatment";
import * as HighCharts from 'highcharts';

@IonicPage()
@Component({
  selector: 'page-repadmin',
  templateUrl: 'repadmin.html',
})
export class Repadmin implements OnInit{
  showHidePatientSMS:boolean;
  showHideEmpSMS:boolean;
  user:string;
  adminFlag:boolean;
  listPatients: Patient[];
  listEmployees: Employee[];
  listTreatments:Treatment[]=[];
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl:AlertController,
              private patientService:PatientService,
              private authService:AuthService,
              private sms:SMS,
              private empService:EmployeeService,
              private treatmentService:TreatmentService) {
    this.showHidePatientSMS=false;
    this.showHideEmpSMS=false;
    this.user = this.authService.getActiveUser().email;
    if(this.user=='test@test.com'){
      this.adminFlag=true;
    }
    else {
      this.adminFlag=false;
    }

  }
  ngOnInit() {
    this.listTreatments=this.navParams.get('treatments');
    this.listEmployees=this.navParams.get('employees');
    //console.log("list treatments is "+this.listTreatments);

  }
  ionViewDidLoad() {
    this.loadPatient();
    this.loadEmployees();
    this.loadTreatments();
    //this.listTreatments=this.treatmentService.getItems();
    if(this.adminFlag==true) {
      this.reportA();
    }
  }
  changeShowStatusPatientForm(){
    this.showHidePatientSMS = !this.showHidePatientSMS;
  }
  changeShowStatusEmployeeForm(){
    this.showHideEmpSMS = !this.showHideEmpSMS;
  }
  sendSMSToAllPatients(form: NgForm){
    this.loadPatient();
    for(let n of this.listPatients){
      this.sms.send(n.patientPhone.toString(),form.value.smsText);
    }
    form.reset();
    this.successWindow("הודעות נשלחו בהצלחה לכלל המטופלים");
    this.changeShowStatusPatientForm();
  }

  sendSMSToAllEmployees(form:NgForm){
    this.loadEmployees();
    for(let n of this.listEmployees){
      this.sms.send(n.employeePhone.toString(),form.value.smsText);
    }
    form.reset();
    this.successWindow("הודעות נשלחו בהצלחה לכלל העובדים");
    this.changeShowStatusEmployeeForm();
  }


  private successWindow(success:string){
    const alert = this.alertCtrl.create({
      message: success,
      buttons: ['חזרה']
    });
    alert.present();
  }

  private loadPatient(){
    /*const loading = this.loadingCtrl.create({
     content: '...אנא המתן'
     });
     loading.present();*/
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.patientService.fetchList(token)
            .subscribe(
              (list: Patient[]) => {
                //loading.dismiss();
                if (list) {
                  this.listPatients = list;
                } else {
                  this.listPatients = [];
                }
              },
              error => {

                this.handleError(error.json().error);
              }
            );
        }
      );
  }
  private loadEmployees(){
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
                  this.listEmployees = list;
                } else {
                  this.listEmployees = [];
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
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.treatmentService.fetchList(token)
            .subscribe(
              (list: Treatment[]) => {
                //loading.dismiss();
                if (list) {
                  this.listTreatments = list;
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
    private reportA()
    {

      let employeeNames={categories: []};
      for(let n of this.listEmployees){
        employeeNames.categories.push(n.employeeName);
      }

      /*for (var i in this.listTreatments) {
        xAxiss.categories[i].push(this.listTreatments[i].employeeName);
      }*/
     // let xAxis=this.xAxis;
      //console.log(this.listTreatments);
      /*for (let i = 0; i < this.listTreatments.length ; i++) {
        xAxis[i].categories.push(this.listTreatments[i].employeeName);
      }*/


      //let xAxis=this.treatmentService.reportA();
      //this.loadTreatments();
      var myChart = HighCharts.chart('container', {
        chart: {
          type: 'spline'
        },
        title: {
          text: 'Fruit Consumption'
        },
        xAxis: employeeNames
              //xAxiss
          /*categories:(function () {
            var categories = [];
            for (let i = 0; i <this.listTreatments.length; i++) {
              categories.push(this.listTreatments[i].employeeName);

            }
            return categories;
          }())*/
        ,
        yAxis: {
          title: {
            text: 'Fruit eaten'
          }
        },
        series: [{
          name: 'Jane',
          data: (function () {
            var data = [];
            for (let i = 0; i <= 10; i += 1) {
              data.push({x: i, y: Math.floor(Math.random() * 10) + 0});
            }
            return data;
          }())
        }, {
          name: 'John', data: (function () {
            var data = [];
            for (let i = 0; i <= 10; i += 1) {
              data.push({x: i, y: Math.floor(Math.random() * 10) + 0});
            }
            return data;
          }())
        }]
      });

    }

}
