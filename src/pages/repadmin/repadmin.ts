import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from "ionic-angular";
import {NgForm} from "@angular/forms";
import {Patient} from "../../models/patient";
import {PatientService} from "../../services/patient";
import {AuthService} from "../../services/auth";
import { SMS } from '@ionic-native/sms';
import {EmployeeService} from "../../services/employee";
import {Employee} from "../../models/employee";


/**
 * Generated class for the RepadminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-repadmin',
  templateUrl: 'repadmin.html',
})
export class Repadmin {
  showHidePatientSMS:boolean;
  showHideEmpSMS:boolean;
  listPatients: Patient[];
  listEmployees: Employee[];
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl:AlertController,
              private patientService:PatientService,
              private authService:AuthService,
              private sms:SMS,
              private empService:EmployeeService) {
    this.showHidePatientSMS=false;
    this.showHideEmpSMS=false;
  }

  ionViewDidLoad() {
    this.loadPatient();
    this.loadEmployees();
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
      console.log("test " + n);
      this.sms.send(n.patientPhone.toString(),form.value.smsText);
    }
    form.reset();
    this.successWindow("הודעות נשלחו בהצלחה לכלל המטופלים");
    this.changeShowStatusPatientForm();
  }

  sendSMSToAllEmployees(form:NgForm){
    this.loadEmployees();
    for(let n of this.listEmployees){
      console.log("test " + n);
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

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: '!שגיאה',
      message: errorMessage,
      buttons: ['חזרה']
    });
    alert.present();
  }
}
