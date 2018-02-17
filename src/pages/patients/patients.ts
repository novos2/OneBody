import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AuthService} from "../../services/auth";
import {PatientService} from "../../services/patient";
import {Patient} from "../../models/patient";
import {Treatment} from "../../models/treatment";
import {TreatmentService} from "../../services/treatment";
import {Treatments} from "../treatments/treatments";
import {EditemployeePage} from "../editemployee/editemployee";
import {EditpatientPage} from "../editpatient/editpatient";
import * as moment from "moment";
import {CallNumber} from "@ionic-native/call-number";
import {SMS} from "@ionic-native/sms";
/**
 * Generated class for the Patients page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-patients',
  templateUrl: 'patients.html',
})
/*export class Patients {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Patients');
  }

}*/
export class Patients implements OnInit {
  flag:boolean;
  listItems: Patient[];
  patient: Patient;

  listTreatments:Treatment[];
  filteredFutureTreatmentList:Treatment[];
  filterFutureTreatmentFlag:boolean;
  filteredPastTreatmentList:Treatment[];
  filterPastTreatmentFlag:boolean;
  myDate= moment().format();
  index: number;
  constructor(public navParams: NavParams,
              private patientService: PatientService,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navCtrl:NavController,
              private treatmentService:TreatmentService,
              private call:CallNumber,
              private sms: SMS) {
    this.flag=false;
  }
  ngOnInit() {
    this.patient = this.navParams.get('patient');
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
  onEditPatient(){
    this.navCtrl.push(EditpatientPage, { patient: this.patient, index: this.index});
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: '!שגיאה',
      message: errorMessage,
      buttons: ['חזרה']
    });
    alert.present();
  }
  onDeletePatient() {
    const alert=this.alertCtrl.create({
      title:'!אזהרה',
      message:'?האם הינך בטוח שברצונך למחוק',
      buttons:[{text:'ביטול'},{
        text:'אישור',
        handler:data=>{
          this.patientService.removeItem(this.index);
          this.saveList();
          this.ionViewDidLoad();
          this.successWindow("מטופל נמחק בהצלחה");
          this.navCtrl.popToRoot();
        }
      }],
      cssClass:"alertDanger"
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
                  this.selectData(this.patient.patientName);
                  this.selectPastData(this.patient.patientName);
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
  searchFutureEmployees(ev: any) {

    // set val to the value of the searchbar
    let val = ev.target.value;
    // Reset items back to all of the items
    if(val.trim()=='') {
      this.loadTreatments();
      this.selectData(this.patient.patientName);
    }
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.filteredFutureTreatmentList = this.filteredFutureTreatmentList.filter((item) => {
        return (item.employeeName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  searchPastEmployees(ev: any) {

    // set val to the value of the searchbar
    let val = ev.target.value;
    // Reset items back to all of the items
    if(val.trim()=='') {
      this.loadTreatments();
      this.selectPastData(this.patient.patientName);
    }
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.filteredPastTreatmentList = this.filteredPastTreatmentList.filter((item) => {
        return (item.employeeName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  selectData(patientName:string){
    this.filteredFutureTreatmentList=this.listTreatments.filter(obj=> obj.patientName==patientName&&obj.treatmentStartDate.slice(0,10)>=this.myDate.slice(0,10)).sort((tr1,tr2)=>{
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

  selectPastData(patientName:string){
    this.filteredPastTreatmentList=this.listTreatments.filter(obj=> obj.patientName==patientName&&obj.treatmentStartDate.slice(0,10)<this.myDate.slice(0,10)).sort((tr1,tr2)=>{
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
  onLoadTreatment(treatment: Treatment, index: number) {
    this.navCtrl.push(Treatments, {treatment: treatment, index: index});
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
  private isAdmin(){
    return this.authService.isAdmin;
  }
  onSendSMSPatient(){
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
            this.sms.send(this.patient.patientPhone.toString(),data.smsText);
          }
        }
      ]
    });
    alert.present();
  }
  onCallNumber(){
    this.call.callNumber(this.patient.patientPhone.toString(),true);
  }
}

