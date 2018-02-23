import {Component, OnInit} from '@angular/core';
import { NgForm } from "@angular/forms";
import {LoadingController, AlertController, NavController, NavParams} from "ionic-angular";
import  { CallNumber } from "@ionic-native/call-number";
import { EmployeeService } from "../../services/employee";
import { Employee } from "../../models/employee";
import { AuthService } from "../../services/auth";
import {Employees} from "../employees/employees";
import {Patient} from "../../models/patient";
import {PatientService} from "../../services/patient";
import {Patients} from "../patients/patients";
import {Treatment} from "../../models/treatment";
import {TreatmentService} from "../../services/treatment";
import {Repadmin} from "../repadmin/repadmin";
//import { EmailComposer } from '@ionic-native/email-composer';
import { SMS } from '@ionic-native/sms';
@Component({
  selector: 'page-registration-employee',
  templateUrl: 'registration-employee.html'
})
export class RegistrationEmployee implements OnInit{
  listEmployees: Employee[];
  listPatients:Patient[];
  listTreatments:Treatment[];
  filteredTreatments:Treatment[];
  showHideEmpList :boolean;
  showHideEmpForm:boolean;
  showHideTreatmentForm:boolean;
  showHidePatientList :boolean;
  showHidePatientForm:boolean;
  index: number;
  treatmentStartDate: string;
  treatmentEndDate: string;
  employeeName:string;
  patientName:string;
  user:string;
  adminFlag:boolean;
  userMail:string;
  searchQuery: string = '';
  constructor(private empService: EmployeeService,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navCtrl:NavController,
              public navParams: NavParams,
              private call:CallNumber,
              private patientService: PatientService,
              private treatmentService:TreatmentService,
              /*private emailComposer: EmailComposer*/
              private sms: SMS
              ) {
    this.showHideEmpList=false;
    this.showHideEmpForm=false;
    this.showHideTreatmentForm=false;
    this.showHidePatientList=false;
    this.showHidePatientForm=false;
    this.user = this.authService.getActiveUser().email;
    if(this.user=='test@test.com'){
      this.adminFlag=true;
    }
    else {
      this.adminFlag=false;
    }
    this.userMail = this.authService.getActiveUser().email;
  }
  ngOnInit() {

    this.index = this.navParams.get('index');
  }
  ionViewWillEnter() {
    this.loadItems();
  }
  ionViewDidLoad(){
    this.loadEmployees();
    this.loadPatient();
  }
  onCallNumber(item:Employee){
    this.call.callNumber(item.employeePhone,true);
  }
  onSendSMSPatient(item:Patient){
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
            this.sms.send(item.patientPhone.toString(),data.smsText);
          }
        }
      ]
    });
    alert.present();
  }
  onSendSMSEmployee(item:Employee){
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
            this.sms.send(item.employeePhone,data.smsText);
          }
        }
      ]
    });
    alert.present();
  }
  onAddEmployee(form: NgForm) {
    //this.loadList();
    if(!this.empService.checkIfExists(this.listEmployees,form.value.employeeID)) {
      this.empService.addItem(form.value.employeeID, form.value.employeeName,
        form.value.employeePhone,form.value.employeeGender, form.value.employeeMail, form.value.employeeDOB);
      form.reset();
      this.loadItems();
      this.saveEmployees();
      this.successWindow("עובד נוסף בהצלחה");
      this.changeShowStatusForm();
    }
    else{
      this.handleError("קיים עובד בעל ת.ז זהה");
    }
  }
  doRefresh(refresher) {
    this.loadPatient();
    this.loadEmployees();
    this.loadItems();
    setTimeout(() => {
      refresher.complete();
    }, 500);
  }
  onAddTreatment(form:NgForm){
    if(this.treatmentService.checkIfStartDateEarlierThanEndDate(this.treatmentStartDate.slice(0,10),this.treatmentEndDate.slice(0,10))){
      if(this.treatmentService.checkIfHourDateEarierIsValid(this.treatmentStartDate.slice(11,16),this.treatmentEndDate.slice(11,16))) {
        if(this.treatmentService.checkIfEmployeeIsntOccupiedDuringThisTime(this.listTreatments,this.employeeName,this.treatmentStartDate.slice(0,10),this.treatmentStartDate.slice(11,16),this.treatmentEndDate.slice(11,16))) {
          if(this.treatmentService.checkIfRoomIsAvailableDuringThisTime(this.listTreatments,this.treatmentStartDate.slice(0,10),this.treatmentStartDate.slice(11,16),this.treatmentEndDate.slice(11,16),form.value.treatmentRoom)) {
            this.treatmentService.addItem(form.value.treatmentType,this.employeeName, this.patientName, this.treatmentStartDate, this.treatmentEndDate, form.value.treatmentRoom, form.value.notes);
            let phone = this.treatmentService.getPhoneByName(this.patientName);
            this.sms.send(phone,             "שלום,"+"\nטיפול נקבע עבורך בתאריך: "+this.treatmentStartDate.slice(0,10)+"\nבין השעות: "+this.treatmentStartDate.slice(11,16)+"-"+this.treatmentEndDate.slice(11,16)+"\nנשמח לראותך,"+"\nהמכון לטיפולי רפואה משלימה - One Body");
              form.reset();
              this.loadItems();
              this.saveTreatments();
              this.successWindow("הטיפול נוסף בהצלחה והודעה נשלחה למטופל");
              this.showHideTreatmentForm=false;
          }
          else{
            this.handleError("חדר "+form.value.treatmentRoom+" תפוס בשעות אלו");
          }
        }
        else{
          this.handleError(this.employeeName+" נמצא בטיפול בשעות אלו");
        }
      }
      else{
        this.handleError("שעת תחילת טיפול מאוחרת משעת סיום טיפול");
      }
    }
    else{
      this.handleError("תאריך תחילת טיפול שונה מתאריך סיום טיפול");
    }
  }

  onAddPatient(form: NgForm) {
    if(!this.patientService.checkIfExists(this.listPatients,form.value.patientID)) {
      this.patientService.addItem(form.value.patientID, form.value.patientName,
        form.value.patientGender,form.value.patientAddress, form.value.patientPhone, form.value.patientMail,form.value.patientDOB);
      form.reset();
      this.loadItems();
      this.savePatient();
      this.successWindow("מטופל נוסף בהצלחה");
      this.changeShowStatusPatientForm();
    }
    else{
      this.handleError("קיים מטופל בעל ת.ז זהה");
    }
  }

  changeShowStatusEmpList(){
    this.showHideEmpList = !this.showHideEmpList;
  }
  changeShowStatusForm(){
    this.showHideEmpForm = !this.showHideEmpForm;
  }
  changeShowStatusPatientList(){
    this.showHidePatientList = !this.showHidePatientList;
  }
  changeShowStatusPatientForm(){
    this.showHidePatientForm = !this.showHidePatientForm;
  }
  changeShowTreatmentForm(){
    this.showHideTreatmentForm = !this.showHideTreatmentForm;
  }


  onCheckItem(index: number) {
    this.empService.removeItem(index);
    this.loadItems();
  }
  onDeleteEmployee() {
    this.empService.removeItem(this.index);
    this.saveEmployees();
    this.ionViewDidLoad();
    this.successWindow("עובד נמחק בהצלחה");
    //this.navCtrl.popToRoot();
  }

  private loadItems() {
    this.listEmployees = this.empService.getItems();
    this.listPatients=this.patientService.getItems();
    this.listTreatments=this.treatmentService.getItems();
  }
  onLoadEmployee(employee: Employee, index: number) {
    if(this.adminFlag||employee.employeeMail==this.userMail)
    this.navCtrl.push(Employees, {employee: employee, index: index});
  }
  onLoadPatient(patient: Patient, index: number) {
    if(this.adminFlag)
    this.navCtrl.push(Patients, {patient: patient, index: index});
  }
  /*onLoadReports(){
    //if(this.adminFlag)
    this.loadItems();
    this.navCtrl.push(Repadmin,{treatments:this.listTreatments,employees:this.listEmployees});
  }*/
  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: '!שגיאה',
      message: errorMessage,
      buttons: ['חזרה']
    });
    alert.present();
  }

  private loadEmployees(){
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
                  this.listEmployees.sort((name1, name2) => {
                    let nameX = name1.employeeName;
                    let nameY = name2.employeeName;
                    if (nameX < nameY)
                      return -1;
                    else if (nameX == nameY) {
                      return 0;
                    }
                    else {
                      return 1;
                    }
                  });
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

  private saveEmployees(){
    const loading = this.loadingCtrl.create({
      content: '...אנא המתן'
    });
    loading.present();
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.empService.storeList(token)
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
  searchEmployees(ev: any) {

    // set val to the value of the searchbar
    let val = ev.target.value;
    // Reset items back to all of the items
    if(val.trim()=='')
      this.loadEmployees();
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listEmployees = this.listEmployees.filter((item) => {
        return (item.employeeName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  searchPatients(ev: any) {

    // set val to the value of the searchbar
    let val = ev.target.value;
    // Reset items back to all of the items
    if(val.trim()=='')
      this.loadPatient();
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listPatients = this.listPatients.filter((item) => {
        return (item.patientName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  private loadPatient(){
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
                  this.listPatients.sort((name1, name2) => {
                    let nameX = name1.patientName;
                    let nameY = name2.patientName;
                    if (nameX < nameY)
                      return -1;
                    else if (nameX == nameY) {
                      return 0;
                    }
                    else {
                      return 1;
                    }
                  });
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

}
