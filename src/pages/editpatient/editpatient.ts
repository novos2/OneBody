import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from "ionic-angular";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth";
import {Patient} from "../../models/patient";
import {PatientService} from "../../services/patient";

/**
 * Generated class for the EditpatientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-editpatient',
  templateUrl: 'editpatient.html',
})
export class EditpatientPage implements OnInit{
  patientForm:FormGroup;
  patient:Patient;
  listPatients: Patient[];
  index:number;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private patientService:PatientService,
              private authService:AuthService,
              private alertCtrl:AlertController,
              private loadingCtrl: LoadingController) {
  }
  ionViewDidLoad(){
    this.loadPatients();
  }
  ngOnInit(){
    this.patient=this.navParams.get('patient');
    this.index= this.navParams.get('index');
    this.initializeForm();
  }
  private loadItems() {
    this.listPatients = this.patientService.getItems();
  }
  onSubmit() {
    const value = this.patientForm.value;
    if (value.patientID != this.patient.patientID) {
      if (!this.patientService.checkIfExists(this.listPatients, value.patientID)) {
        this.patientService.updatePatient(this.index, value.patientID, value.patientName, value.patientPhone, value.patientAddress, value.patientGender, value.patientMail, value.patientDOB);
        this.loadItems();
        this.savePatient();
        this.successWindow("מטופל נערך בהצלחה");
        this.patientForm.reset();
        this.navCtrl.popToRoot();
      }
      else {
        this.handleError("קיים מטופל בעל ת.ז זהה");
      }
    }
    else {
      this.patientService.updatePatient(this.index, value.patientID, value.patientName, value.patientPhone, value.patientAddress, value.patientGender, value.patientMail, value.patientDOB);
      this.loadItems();
      this.savePatient();
      this.successWindow("מטופל נערך בהצלחה");
      this.patientForm.reset();
      this.navCtrl.popToRoot();

    }
  }
  private initializeForm(){
      let patientID = this.patient.patientID;
      let patientName = this.patient.patientName;
      let patientPhone = this.patient.patientPhone;
      let patientGender = this.patient.patientGender;
      let patientMail = this.patient.patientMail;
      let patientDOB = this.patient.patientDOB;
      let patientAddress = this.patient.patientAddress;
      this.patientForm = new FormGroup({
        'patientID': new FormControl(patientID,Validators.required),
        'patientName': new FormControl(patientName,Validators.required),
        'patientPhone': new FormControl(patientPhone,Validators.required),
        'patientGender': new FormControl(patientGender),
        'patientMail': new FormControl(patientMail),
        'patientDOB': new FormControl(patientDOB),
        'patientAddress': new FormControl(patientAddress)
      });
    }


  private loadPatients(){
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

  private savePatient(){
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

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: '!שגיאה',
      message: errorMessage,
      buttons: ['חזרה']
    });
    alert.present();

  }
  private successWindow(success:string){
    const alert = this.alertCtrl.create({
      message: success,
      buttons: ['חזרה']
    });
    alert.present();
  }

}
