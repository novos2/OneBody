import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController} from 'ionic-angular';
import {PatientService} from "../../services/patient";
import { NgForm } from "@angular/forms";
import {Patient} from "../../models/patient";
import {AuthService} from "../../services/auth";
import {Patients} from "../patients/patients";
@IonicPage()
@Component({
  selector: 'page-registration-patient',
  templateUrl: 'registration-patient.html',
})
export class RegistrationPatient {



  /*selectOptions = ["זכר", "נקבה"];*/

  /*constructor(private pService:PatientService) {
  }*/
  /*ionViewDidLoad(){
    console.log(" didLoad clicked successfully from registrationPatient.ts");
    //this.pService.ionViewWillEnter();
    //this.pService.loadPatientsFromServer();
  }
  onAddPatient(form: NgForm) {
    /!*console.log("clicked successfully");
    this.pService.loadPatientsFromServer();*!/
    this.pService.addItem(form.value.patientID,form.value.patientFirstName,
      form.value.patientLastName,form.value.patientGender,form.value.patientAddress,form.value.patientPhone,
      form.value.patientMail,form.value.patientDOB);
    form.reset();
    /!*this.loadItems();*!/
  }*/
  listItems: Patient[];
  showHideEmpList :boolean;
  showHideForm:boolean;
  constructor(private patientService: PatientService,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navCtrl:NavController) {
    this.showHideEmpList=false;
    this.showHideForm=false;

  }

 ionViewWillEnter() {
    this.loadItems();
  }
  ionViewDidLoad(){
    this.loadList();
    console.log("console is:"+this.listItems);
  }

  onAddPatient(form: NgForm) {
    //this.loadList();
    if(!this.patientService.checkIfExists(this.listItems,form.value.patientID)) {
      this.patientService.addItem(form.value.patientID, form.value.patientFirstName, form.value.patientLastName,
        form.value.patientGender,form.value.patientAddress, form.value.patientPhone, form.value.patientMail,form.value.patientDOB);
      form.reset();
      this.loadItems();
      this.saveList();
      this.successWindow("מטופל נוסף בהצלחה");
    }
    else{
      this.handleError("קיים מטופל בעל ת.ז זהה");
    }
  }
  changeShowStatusEmpList(){
    this.showHideEmpList = !this.showHideEmpList;
    if(this.showHideForm)
      this.showHideForm=false;
  }
  changeShowStatusForm(){
    this.showHideForm = !this.showHideForm;
    if(this.showHideEmpList)
      this.showHideEmpList=false;
  }

  onCheckItem(index: number) {
    this.patientService.removeItem(index);
    this.loadItems();
  }

  private loadItems() {
    this.listItems = this.patientService.getItems();
  }
  onLoadPatient(patient: Patient, index: number) {
    this.navCtrl.push(Patients, {patient: patient, index: index});
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: '!שגיאה',
      message: errorMessage,
      buttons: ['חזרה']
    });
    alert.present();
  }

  private loadList(){
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

  private saveList(){
    const loading = this.loadingCtrl.create({
      content: '...אנא המתן'
    });
    loading.present();
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.patientService.storeList(token)
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



}
