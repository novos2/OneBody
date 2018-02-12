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
  filteredTreatmentList:Treatment[];
  filterTreatmentFlag:boolean;
  index: number;
  constructor(public navParams: NavParams,
              private patientService: PatientService,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navCtrl:NavController,
              private treatmentService:TreatmentService) {
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
  selectData(patientName:string){
    this.filteredTreatmentList=this.listTreatments.filter(obj=> obj.patientName==patientName);
    if(this.filteredTreatmentList.length>0){
      this.filterTreatmentFlag=true;
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
}

