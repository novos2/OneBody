import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from "ionic-angular";
import {NgForm} from "@angular/forms";
import {Patient} from "../../models/patient";
import {PatientService} from "../../services/patient";
import {AuthService} from "../../services/auth";
import { SMS } from '@ionic-native/sms';
import {EmployeeService} from "../../services/employee";
import {Employee} from "../../models/employee";
import {Treatment} from "../../models/treatment";
import {TreatmentService} from "../../services/treatment";
import * as HighCharts from 'highcharts';
import * as moment from "moment";
@IonicPage()
@Component({
  selector: 'page-repadmin',
  templateUrl: 'repadmin.html',
})
export class Repadmin implements OnInit {
  showHidePatientSMS: boolean;
  showHideEmpSMS: boolean;
  showHideReports:boolean;
  reportsButtons:boolean;
  user: string;
  count: number;
  adminFlag: boolean;
  listPatients: Patient[];
  listEmployees: Employee[];
  listTreatments: Treatment[] = [];
  sortedTreatmentsByType:Treatment[]=[];
  countedTreatmentsEmp: any[]=[];
  treatmentByTypeOnlyNames:any[]=[];
  treatmenyByTypeOnlyNumbers:any[]=[];
  countedTreatmentsOverall:any[]=[0,0,0,0,0,0,0,0,0,0,0,0];
  prevCount=1;
  myDate= moment().format();
  selectedDate=moment().format();
  selectedYear=moment().format();
  selectedMonth=moment().format();
  changeShowContainerZ:boolean;
  changeShowContainerY:boolean;
  changeShowContainerX:boolean;
  changeShowContainerW:boolean;
  changeShowContainerV:boolean;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private patientService: PatientService,
              private authService: AuthService,
              private sms: SMS,
              private empService: EmployeeService,
              private treatmentService: TreatmentService) {
    this.showHidePatientSMS = false;
    this.showHideEmpSMS = false;
    this.showHideReports=false;
    this.reportsButtons=false;
    this.user = this.authService.getActiveUser().email;
    if (this.user == 'test@test.com') {
      this.adminFlag = true;
    }
    else {
      this.adminFlag = false;
    }
    this.changeShowContainerZ=false;
    this.changeShowContainerY=false;
    this.changeShowContainerX=false;
    this.changeShowContainerW=false;
    this.changeShowContainerV=false;
  }

  ngOnInit() {
    this.listTreatments = this.navParams.get('treatments');
    this.listEmployees = this.navParams.get('employees');
   }

  ionViewDidLoad() {
    this.loadPatient();
    this.loadEmployees();
    this.loadTreatments();
  }


  changeShowStatusPatientForm() {
    this.showHidePatientSMS = !this.showHidePatientSMS;
  }

  changeShowStatusEmployeeForm() {
    this.showHideEmpSMS = !this.showHideEmpSMS;
  }
  changeShowStatusReport(){
    this.showHideReports=!this.showHideReports;
  }

  sendSMSToAllPatients(form: NgForm) {
    this.loadPatient();
    for (let n of this.listPatients) {
      this.sms.send(n.patientPhone.toString(), form.value.smsText);
    }
    form.reset();
    this.successWindow("הודעות נשלחו בהצלחה לכלל המטופלים");
    this.changeShowStatusPatientForm();
  }

  sendSMSToAllEmployees(form: NgForm) {
    this.loadEmployees();
    for (let n of this.listEmployees) {
      this.sms.send(n.employeePhone.toString(), form.value.smsText);
    }
    form.reset();
    this.successWindow("הודעות נשלחו בהצלחה לכלל העובדים");
    this.changeShowStatusEmployeeForm();
  }


  private successWindow(success: string) {
    const alert = this.alertCtrl.create({
      message: success,
      buttons: ['חזרה']
    });
    alert.present();
  }

  private loadPatient() {
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

  private loadEmployees() {
    /*const loading = this.loadingCtrl.create({
      content: '...אנא המתן'
    });
    loading.present();*/
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.empService.fetchList(token)
            .subscribe(
              (list: Employee[]) => {
                //loading.dismiss();
                if (list) {
                  this.listEmployees = list;
                } else {
                  this.listEmployees = [];
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

  private loadTreatments() {
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

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: '!שגיאה',
      message: errorMessage,
      buttons: ['חזרה']
    });
    alert.present();
  }

  private selectDateFunc(date:string){
    this.selectedMonth=date.slice(0,7);
    this.selectedYear=date.slice(0,4);
    /*this.reportCYearly();
    this.reportBYearly();
    this.reportBMonthly();
    this.reportAYearly();
    this.reportAMonthly();
    this.changeShowContainerV=false;
    this.changeShowContainerW=false;
    this.changeShowContainerX=false;
    this.changeShowContainerY=false;
    this.changeShowContainerZ=false;*/
  }

  private countTreatmentsEmpYearly(year:string) {
    this.countedTreatmentsEmp=[];
    for (let i of this.listEmployees) {
      this.count = 0;
      for (let j of this.listTreatments) {
        if (i.employeeName == j.employeeName && j.treatmentStartDate.slice(0,4)==year) {
          this.count++;
        }
      }
      this.countedTreatmentsEmp.push(this.count);
    }
  }
  private countTreatmentsEmpMonthly(year:string) {
    this.countedTreatmentsEmp=[];
    for (let i of this.listEmployees) {
      this.count = 0;
      for (let j of this.listTreatments) {
        if (i.employeeName == j.employeeName && j.treatmentStartDate.slice(0,7)==year) {
          this.count++;
        }
      }
      this.countedTreatmentsEmp.push(this.count);
    }
  }
  private countTreatmentsOverall(year:string) {
    this.loadTreatments();
    let a=0;//1
    let b=0;//2
    let c=0;//3
    let d=0;//4
    let e=0;//5
    let f=0;//6
    let g=0;//7
    let h=0;//8
    let i=0;//9
    let j=0;//10
    let k=0;//11
    let l=0;//12
    this.countedTreatmentsOverall=[0,0,0,0,0,0,0,0,0,0,0,0];
    for (let n of this.listTreatments) {
      let month=parseInt(n.treatmentStartDate.slice(5,7));
      let yearX=n.treatmentStartDate.slice(0,4);
      if(yearX==year) {
        if (month == 1) {
          a++;
        }
        if (month == 2) {
          b++
        }
        if (month == 3) {
          c++
        }
        if (month == 4) {
          d++;
        }
        if (month == 5) {
          e++;
        }
        if (month == 6) {
          f++;
        }
        if (month == 7) {
          g++;
        }
        if (month == 8) {
          h++;
        }
        if (month == 9) {
          i++;
        }
        if (month == 10) {
          j++;
        }
        if (month == 11) {
          k++;
        }
        if (month == 12) {
          l++;
        }
      }
    }
    this.countedTreatmentsOverall[0]=a;
    this.countedTreatmentsOverall[1]=b;
    this.countedTreatmentsOverall[2]=c;
    this.countedTreatmentsOverall[3]=d;
    this.countedTreatmentsOverall[4]=e;
    this.countedTreatmentsOverall[5]=f;
    this.countedTreatmentsOverall[6]=g;
    this.countedTreatmentsOverall[7]=h;
    this.countedTreatmentsOverall[8]=i;
    this.countedTreatmentsOverall[9]=j;
    this.countedTreatmentsOverall[10]=k;
    this.countedTreatmentsOverall[11]=l;
  }
  private countTreatmentTypeYearly(year:string){
    this.loadTreatments();
    this.treatmentByTypeOnlyNames=[];
    this.treatmenyByTypeOnlyNumbers=[];
    let prevType='';
    this.sortedTreatmentsByType=this.listTreatments.filter(obj => obj.treatmentStartDate.slice(0, 4) == year).sort((tr1, tr2) => {
      let date1 = tr1.treatmentType;
      let date2 = tr2.treatmentType;
      if (date1 < date2)
        return -1;
      else if (date1 == date2) {
        return 0;
      }
      else {
        return 1;
      }
    });
    this.count=1;
    for(let n of this.sortedTreatmentsByType){
      if(prevType!=n.treatmentType){
        this.treatmenyByTypeOnlyNumbers.push(this.prevCount);
        this.treatmentByTypeOnlyNames.push(prevType);
        this.count = 1;
      }
      this.prevCount=this.count;
      this.count++;
      prevType=n.treatmentType;
    }
    this.treatmentByTypeOnlyNames=this.treatmentByTypeOnlyNames.slice(1,this.treatmentByTypeOnlyNames.length);
    this.treatmenyByTypeOnlyNumbers=this.treatmenyByTypeOnlyNumbers.slice(1,this.treatmenyByTypeOnlyNumbers.length);
  }
  private countTreatmentTypeMonthly(year:string){
    this.loadTreatments();
    this.treatmentByTypeOnlyNames=[];
    this.treatmenyByTypeOnlyNumbers=[];
    let prevType='';
    this.sortedTreatmentsByType=this.listTreatments.filter(obj => obj.treatmentStartDate.slice(0, 7) == year).sort((tr1, tr2) => {
      let date1 = tr1.treatmentType;
      let date2 = tr2.treatmentType;
      if (date1 < date2)
        return -1;
      else if (date1 == date2) {
        return 0;
      }
      else {
        return 1;
      }
    });
    this.count=1;
    for(let n of this.sortedTreatmentsByType){
      if(prevType!=n.treatmentType){
        this.treatmenyByTypeOnlyNumbers.push(this.prevCount);
        this.treatmentByTypeOnlyNames.push(prevType);
        this.count = 1;
      }
      this.prevCount=this.count;
      this.count++;
      prevType=n.treatmentType;
    }
    this.treatmentByTypeOnlyNames=this.treatmentByTypeOnlyNames.slice(1,this.treatmentByTypeOnlyNames.length);
    this.treatmenyByTypeOnlyNumbers=this.treatmenyByTypeOnlyNumbers.slice(1,this.treatmenyByTypeOnlyNumbers.length);
  }
  private changeShowContainer1(){
    this.changeShowContainerX=!this.changeShowContainerX;
    //if(this.changeShowContainerX)
      this.reportAYearly();
  }
  private changeShowContainer4(){
    this.changeShowContainerW=!this.changeShowContainerW;
    //if(this.changeShowContainerW)
      this.reportAMonthly();
  }
  private reportAYearly() {
    if (this.adminFlag == true) {
      this.countTreatmentsEmpYearly(this.selectedYear.slice(0, 4));
      let employeeNames = {categories: []};
      for (let n of this.listEmployees) {
        employeeNames.categories.push(n.employeeName);
      }
      var myChart = HighCharts.chart('container', {
        chart: {
          type: 'bar'
        },
        title: {
          text: 'מספר טיפולים לעובד בשנת ' + this.selectedYear.slice(0, 4),
          cssClass: 'titleMessage'
        },
        xAxis: employeeNames
        ,
        yAxis: {
          title: {
            text: 'מספר טיפולים',
            cssClass: 'rtlMessage'
          }
        },
        series: [{
          name: 'כמות',
          data: this.countedTreatmentsEmp
        }]
      });
    }
  }

  private reportAMonthly() {
    if (this.adminFlag == true) {
      this.countTreatmentsEmpMonthly(this.selectedMonth.slice(0, 7));
      let employeeNames = {categories: []};
      for (let n of this.listEmployees) {
        employeeNames.categories.push(n.employeeName);
      }
      var myChart = HighCharts.chart('container4', {
        chart: {
          type: 'bar'
        },
        title: {
          text: ' מספר טיפולים לעובד ב- '+this.selectedMonth.slice(5,7)+'-'+this.selectedMonth.slice(0,4),
          cssClass: 'titleMessage'
        },
        xAxis: employeeNames
        ,
        yAxis: {
          title: {
            text: 'מספר טיפולים',
            cssClass: 'rtlMessage'
          }
        },
        series: [{
          name: 'כמות',
          data: this.countedTreatmentsEmp
        }]
      });
    }
  }

  private changeShowContainer2(){
    this.changeShowContainerY=!this.changeShowContainerY;
    //if(this.changeShowContainerY)
      this.reportBYearly();
  }
  private changeShowContainer5(){
    this.changeShowContainerV=!this.changeShowContainerV;
    //if(this.changeShowContainerV)
      this.reportBMonthly();
  }
  private reportBYearly(){
    if(this.adminFlag==true) {
      this.countTreatmentTypeYearly(this.selectedYear.slice(0,4));
      var myChart = HighCharts.chart('container2', {
        chart: {
          type: 'bar'
        },
        title: {
          text: ' מספר טיפולים בשנת '+this.selectedYear.slice(0,4)+' לפי סוג',
          cssClass: 'titleMessage'
        },
        xAxis: {categories:this.treatmentByTypeOnlyNames}
        ,
        yAxis: {
          title: {
            text: 'מספר טיפולים',
            cssClass: 'rtlMessage'
          }
        },
        series: [{
          name: 'כמות',
          data: this.treatmenyByTypeOnlyNumbers,
        }]
      });
    }
  }
  private reportBMonthly(){
    if(this.adminFlag==true) {
      this.countTreatmentTypeMonthly(this.selectedMonth.slice(0,7));
      var myChart = HighCharts.chart('container5', {
        chart: {
          type: 'bar'
        },
        title: {
          text: ' מספר טיפולים ב- '+this.selectedMonth.slice(5,7)+'-'+this.selectedMonth.slice(0,4)+' לפי סוג',
          cssClass: 'titleMessage'
        },
        xAxis: {categories:this.treatmentByTypeOnlyNames}
        ,
        yAxis: {
          title: {
            text: 'מספר טיפולים',
            cssClass: 'rtlMessage'
          }
        },
        series: [{
          name: 'כמות',
          data: this.treatmenyByTypeOnlyNumbers,
        }]
      });
    }
  }

  private changeShowContainer3(){
    this.changeShowContainerZ=!this.changeShowContainerZ;
   // if(this.changeShowContainerZ)
    this.reportCYearly();
  }
  private reportCYearly() {
    if (this.adminFlag == true) {

      this.countTreatmentsOverall(this.selectedYear.slice(0,4));
      var myChart = HighCharts.chart('container3', {
        chart: {
          type: 'bar'
        },
        title: {
          text: ' מספר טיפולים בשנת '+this.selectedYear.slice(0,4),
          cssClass: 'titleMessage'
        },
        xAxis: {categories:['1','2','3','4','5','6','7','8','9','10','11','12']},
        cssClass: 'rtlMessage'
        ,
        yAxis: {
          title: {
            text: 'מספר טיפולים',
            cssClass: 'rtlMessage'
          }
        },
        series: [{
          name: 'כמות',
          data: this.countedTreatmentsOverall,
        }]
      });

    }
  }

}
