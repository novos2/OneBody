import {Component, OnInit} from '@angular/core';
import {AlertController,LoadingController, NavParams,NavController} from 'ionic-angular';
import {Employee} from "../../models/employee";
import {EmployeeService} from "../../services/employee";
import {AuthService} from "../../services/auth";
import {Treatment} from "../../models/treatment";
import {TreatmentService} from "../../services/treatment";
import {EdittreatmentPage} from "../edittreatment/edittreatment";




@Component({
  selector: 'page-treatments',
  templateUrl: 'treatments.html',
})
export class Treatments implements OnInit{
  flag:boolean;
  listTreatments: Treatment[];
  employee: Employee;
  treatment: Treatment;
  index: number;
  constructor(public navParams: NavParams,
              private empService: EmployeeService,
              private treatmentService: TreatmentService,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navCtrl:NavController,
  ) {
    this.flag=false;
  }
  ngOnInit() {
    this.treatment = this.navParams.get('treatment');
    this.index = this.navParams.get('index');
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
  private saveTreatments(){
    const loading = this.loadingCtrl.create({
      content: '...אנא המתן'
    });
    loading.present();
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.treatmentService.storeList(token)
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

  onLoadEditTreatment(){
    this.index=this.treatmentService.getIndexByName(this.treatment.employeeName,this.treatment.patientName,this.treatment.treatmentStartDate);
    this.navCtrl.push(EdittreatmentPage, { treatment: this.treatment, index: this.index});
  }
  }
