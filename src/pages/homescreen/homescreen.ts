import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage} from 'ionic-angular';
import * as moment from 'moment';
import {Calendar} from '@ionic-native/calendar';
import {Employee} from "../../models/employee";
import {Treatment} from "../../models/treatment";
import {TreatmentService} from "../../services/treatment";
@IonicPage()
@Component({
  selector: 'page-homescreen',
  templateUrl: 'homescreen.html',
})
export class Homescreen implements OnInit{
  myDate= moment().format();
  notes:boolean;
  calendarItems:boolean;
  filterTreatmentFlag=false;
  listTreatments:Treatment[];
  filteredTreatmentList: Treatment[];
  constructor(private calendar: Calendar,private alertCtrl: AlertController,private treatmentService:TreatmentService) {
    this.notes=false;
    this.calendarItems=false;
  }
  showCalendar(){
    this.calendarItems = !this.calendarItems;
    console.log("myDate: "+this.myDate.toString());
    if(this.notes)
      this.notes=false;
    this.calendar.createCalendar('MyCalendar').then((msg)=>{console.log(msg);},(err)=>{console.log(err);})


  }
  showNotes(){
    this.notes = !this.notes;
    if(this.calendarItems)
      this.calendarItems=false;

  }
  ngOnInit() {
    /*console.log("test");
    this.loadTreatments();*/
  }

  ionViewDidLoad(){

    this.loadTreatments();
  }
  selectData(date: string){
    let modifiedDate = date.slice(0,10);
    this.filteredTreatmentList=this.listTreatments.filter(obj=> obj.treatmentStartDate.slice(0,10)==modifiedDate);
    this.filterTreatmentFlag=true;
    console.log(this.listTreatments);
    console.log(this.filteredTreatmentList);
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
}
