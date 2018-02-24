import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController,NavParams} from 'ionic-angular';
import {PatientService} from "../../services/patient";
import { NgForm } from "@angular/forms";
import {Patient} from "../../models/patient";
import {AuthService} from "../../services/auth";
import {Patients} from "../patients/patients";

@Component({
  selector: 'page-registration-patient',
  templateUrl: 'registration-patient.html',
})
export class RegistrationPatient implements OnInit{

  listItems: Patient[];
  showHidePatientList :boolean;
  showHidePatientForm:boolean;
  index: number;
  constructor(private patientService: PatientService,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navCtrl:NavController,
              public navParams: NavParams) {
    this.showHidePatientList=false;
    this.showHidePatientForm=false;

  }

 ionViewWillEnter() {
    this.loadItems();
  }
  ionViewDidLoad(){
    this.loadList();
    console.log("console is:"+this.listItems);
  }
  ngOnInit() {

    this.index = this.navParams.get('index');
  }
  onAddPatient(form: NgForm) {
    //this.loadList();
    if(!this.patientService.checkIfExists(this.listItems,form.value.patientID)) {
      this.patientService.addItem(form.value.patientID, form.value.patientName,
        form.value.patientGender,form.value.patientAddress, form.value.patientPhone, form.value.patientMail,form.value.patientDOB);
      form.reset();
      this.loadItems();
      this.saveList();
      this.successWindow("מטופל נוסף בהצלחה");
      this.changeShowStatusPatientForm();
    }
    else{
      this.handleError("קיים מטופל בעל ת.ז זהה");
    }
  }
  changeShowStatusPatientList(){
    this.showHidePatientList = !this.showHidePatientList;
  }
  changeShowStatusPatientForm(){
    this.showHidePatientForm = !this.showHidePatientForm;
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
