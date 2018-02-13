import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavParams,NavController} from 'ionic-angular';
import {Employee} from "../../models/employee";
import {EmployeeService} from "../../services/employee";
import {AuthService} from "../../services/auth";
import {Treatment} from "../../models/treatment";
import {TreatmentService} from "../../services/treatment";
import {EdittreatmentPage} from "../edittreatment/edittreatment";



@IonicPage()
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
  private isAdmin(){
    return this.authService.isAdmin;
  }
  onLoadEditTreatment(){
    this.index=this.treatmentService.getIndexByName(this.treatment.employeeName,this.treatment.patientName,this.treatment.treatmentStartDate);
    this.navCtrl.push(EdittreatmentPage, { treatment: this.treatment, index: this.index});
  }

  private onDeleteTreatment() {
    const alert=this.alertCtrl.create({
      title:'!אזהרה',
      message:'?האם הינך בטוח שברצונך למחוק',
      buttons:[{text:'ביטול'},{
        text:'אישור',
        handler:data=>{
          this.index=this.treatmentService.getIndexByName(this.treatment.employeeName,this.treatment.patientName,this.treatment.treatmentStartDate);
          //let phone = this.treatmentService.getPhoneByName(this.treatment.patientName);
          /*          this.sms.send(phone,            "שלום,"+"\nהטיפול שנקבע עבורך בתאריך: "+this.treatment.treatmentStartDate.slice(0,10)+"\nבין השעות: "+this.treatment.treatmentStartDate.slice(11,16)+"-"+this.treatment.treatmentEndDate.slice(11,16)+"\nבוטל."+"לתיאום מחדש אנא צור קשר עימנו."+"\nבתודה מראש,"+"\nהמכון לטיפולי רפואה משלימה - One Body");*/

          //        "שלום,"+"\nהטיפול שנקבע עבורך בתאריך: "+this.treatment.treatmentStartDate.slice(0,10)+"\n בין השעות: "+this.treatment.treatmentStartDate.slice(11,16)+"-"+this.treatment.treatmentEndDate.slice(11,16)+" בוטל."+"\nבתודה מראש,"+"\nהמכון לטיפולי רפואה משלימה - One Body"

          this.treatmentService.removeItem(this.index);
          this.saveTreatments();
          this.loadList();
          this.successWindow("טיפול נמחק בהצלחה");
          this.navCtrl.popToRoot();
        }
      }],
      cssClass:"alertDanger"
    });
    alert.present();
  }

}
