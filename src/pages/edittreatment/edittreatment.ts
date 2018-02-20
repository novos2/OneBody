import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from "ionic-angular";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Treatment} from "../../models/treatment";
import {AuthService} from "../../services/auth";
import {TreatmentService} from "../../services/treatment";
import {SMS} from "@ionic-native/sms";


/**
 * Generated class for the EdittreatmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-edittreatment',
  templateUrl: 'edittreatment.html',
})
export class EdittreatmentPage implements OnInit{
  treatmentForm:FormGroup;
  treatment:Treatment;
  listTreatments: Treatment[];
  index:number;
  user:string;
  adminFlag:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl:AlertController,
              private authService:AuthService,
              private loadingCtrl: LoadingController,
              private treatmentService:TreatmentService,
              private sms: SMS) {
    this.user = this.authService.getActiveUser().email;
    if(this.user=='test@test.com'){
      this.adminFlag=true;
    }
    else {
      this.adminFlag=false;
    }
  }
  ngOnInit(){
    this.treatment=this.navParams.get('treatment');
    this.index= this.navParams.get('index');
    this.initializeForm();
  }

  ionViewDidLoad(){
    this.loadTreatment();
  }
  private loadItems() {
    this.listTreatments = this.treatmentService.getItems();
  }
  onSubmit() {
    const value = this.treatmentForm.value;
    if(this.treatmentService.checkIfStartDateEarlierThanEndDate(value.treatmentStartDate.slice(0,10),value.treatmentEndDate.slice(0,10))){
      if(this.treatmentService.checkIfHourDateEarierIsValid(value.treatmentStartDate.slice(11,16),value.treatmentEndDate.slice(11,16))) {
        if(this.treatmentService.checkForEditTreatmentIfEmployeeIsntOccupiedDuringThisTime(this.listTreatments,this.treatment.employeeName,this.treatment.patientName,value.treatmentStartDate.slice(0,10),value.treatmentStartDate.slice(11,16),value.treatmentEndDate.slice(11,16))) {
          if(this.treatmentService.checkForEditIfRoomIsAvailableDuringThisTime(this.listTreatments,this.treatment.employeeName,this.treatment.patientName,value.treatmentStartDate.slice(0,10),value.treatmentStartDate.slice(11,16),value.treatmentEndDate.slice(11,16),value.treatmentRoom)) {
            this.treatmentService.updateTreatment(this.index, value.treatmentType, this.treatment.employeeName, this.treatment.patientName, value.treatmentStartDate, value.treatmentEndDate, value.treatmentRoom, value.notes);
            //let phone = this.treatmentService.getPhoneByName(value.patientName);
            //this.sms.send(phone,             "שלום,"+"\nטיפול שונה עבורך לתאריך: "+value.treatmentStartDate.slice(0,10)+"\nבין השעות: "+value.treatmentStartDate.slice(11,16)+"-"+value.treatmentEndDate.slice(11,16)+"\nנשמח לראותך,"+"\nהמכון לטיפולי רפואה משלימה - One Body");
            this.loadItems();
            this.saveTreatments();
            this.successWindow("טיפול נערך בהצלחה");
            this.treatmentForm.reset();
            this.navCtrl.popToRoot();
            /*            let mail= this.treatmentService.getMailByName(this.patientName);
                        let email = {
                          to: mail,
                          subject: 'טיפול נקבע עבורך',
                          body: 'How are you? Nice greetings from Leipzig',
                          isHtml: true
                        };
                        this.emailComposer.isAvailable().then((available: boolean) =>{
                          if(available) {
                            //Now we know we can send
                            this.emailComposer.open(email);
                          }
                        });*/

          }
          else{
            this.handleError("חדר זה תפוס בשעות אלו");
          }
        }
        else{
          this.handleError("עובד זה נמצא בטיפול בשעות אלו");
        }
      }
      else{
        this.handleError("שעת תחילת טיפול גדולה משעת סיום טיפול");
      }
    }
    else{
      this.handleError("תאריך תחילת טיפול שונה מתאריך סיום טיפול");
    }
  }
  private initializeForm(){
    let treatmentType = this.treatment.treatmentType;
    let treatmentStartDate = this.treatment.treatmentStartDate;
    let treatmentEndDate = this.treatment.treatmentEndDate;
    let treatmentRoom = this.treatment.treatmentRoom;
    let notes = this.treatment.notes;
    this.treatmentForm = new FormGroup({
      'treatmentType': new FormControl(treatmentType,Validators.required),
      'treatmentStartDate': new FormControl(treatmentStartDate,Validators.required),
      'treatmentEndDate': new FormControl(treatmentEndDate,Validators.required),
      'treatmentRoom': new FormControl(treatmentRoom,Validators.required),
      'notes': new FormControl(notes)
    });
  }
  private loadTreatment(){
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
  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: '!שגיאה',
      message: errorMessage,
      buttons: ['חזרה']
    });
    alert.present();

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
          this.loadItems();
          this.saveTreatments();
          this.successWindow("טיפול נמחק בהצלחה");
          this.navCtrl.popToRoot();
        }
      }],
      cssClass:"alertDanger"
    });
    alert.present();
  }

}
