import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage} from 'ionic-angular';
import * as moment from 'moment';
import {Treatment} from "../../models/treatment";
import {TreatmentService} from "../../services/treatment";
@IonicPage()
@Component({
  selector: 'page-homescreen',
  templateUrl: 'homescreen.html',
})
export class Homescreen implements OnInit{
  myDate= moment().format();
  today:string;
  notes:boolean;
  listEmpty:boolean;
  filterTreatmentFlag:boolean;
  listTreatments:Treatment[];
  filteredTreatmentList: Treatment[];
  constructor(private alertCtrl: AlertController,private treatmentService:TreatmentService) {
    this.notes=false;
    this.filterTreatmentFlag=false;
    this.today=moment().format();
  }
/*  showCalendar(){
    this.calendarItems = !this.calendarItems;
    console.log("myDate: "+this.myDate.toString());
    if(this.notes)
      this.notes=false;
    this.calendar.createCalendar('MyCalendar').then((msg)=>{console.log(msg);},(err)=>{console.log(err);})


  }*/
 /* showNotes(){
    this.notes = !this.notes;
    if(this.calendarItems)
      this.calendarItems=false;

  }*/
  ngOnInit() {
   // console.log("test");
    //this.loadTreatments();
  }
  /*ionViewDidEnter(){
    console.log("test");
    this.loadTreatments();

  }*/
  ionViewDidLoad(){
    this.loadTreatments();
    console.log("date is: "+this.today);
    //this.selectData(this.today);
  }

  selectData(date: string){
    let modifiedDate = date.slice(0,10);
    console.log("modified date is: "+modifiedDate);
    this.filteredTreatmentList=this.listTreatments.filter(obj=> obj.treatmentStartDate.slice(0,10)==modifiedDate);
    if(this.filteredTreatmentList.length==0){
      this.listEmpty=true;
    }
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
                  this.selectData(this.today);
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
