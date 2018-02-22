import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from "ionic-angular";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Employee} from "../../models/employee";
import {AuthService} from "../../services/auth";
import {EmployeeService} from "../../services/employee";


/**
 * Generated class for the EditemployeePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-editemployee',
  templateUrl: 'editemployee.html',
})
export class EditemployeePage implements OnInit{
  employeeForm:FormGroup;
  employee:Employee;
  listEmployees: Employee[];
  index:number;
  user:string;
  adminFlag:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, private authService:AuthService,
              private empService:EmployeeService,
              private alertCtrl:AlertController,
              private loadingCtrl: LoadingController) {
    this.user = this.authService.getActiveUser().email;
    if(this.user=='test@test.com'){
      this.adminFlag=true;
    }
    else {
      this.adminFlag=false;
    }
  }
  ionViewDidLoad(){
    this.loadEmployees();
  }
  ngOnInit(){
    this.employee=this.navParams.get('employee');
    this.index= this.navParams.get('index');
    this.initializeForm();

  }
  private loadItems() {
    this.listEmployees = this.empService.getItems();
  }
  onSubmit(){
    const value = this.employeeForm.value;
    if(value.employeeID!=this.employee.employeeID){
      if(!this.empService.checkIfExists(this.listEmployees,value.employeeID)){
        this.empService.updateEmployee(this.index,value.employeeID,value.employeeName,value.employeePhone,value.employeeGender,value.employeeMail,value.employeeDOB);
        this.loadItems();
        this.saveEmployees();
        this.successWindow("עובד נערך בהצלחה");
        this.employeeForm.reset();
        this.navCtrl.popToRoot();
      }
      else{
        this.handleError("קיים עובד בעל ת.ז זהה");
      }
    }
    else{
      this.empService.updateEmployee(this.index,value.employeeID,value.employeeName,value.employeePhone,value.employeeGender,value.employeeMail,value.employeeDOB);
      this.loadItems();
      this.saveEmployees();
      this.successWindow("עובד נערך בהצלחה");
      this.employeeForm.reset();
      this.navCtrl.popToRoot();
    }


  }
  private initializeForm(){
    let employeeID = this.employee.employeeID;
    let employeeName = this.employee.employeeName;
    let employeePhone = this.employee.employeePhone;
    let employeeGender = this.employee.employeeGender;
    let employeeMail = this.employee.employeeMail;
    let employeeDOB = this.employee.employeeDOB;
    this.employeeForm = new FormGroup({
      'employeeID': new FormControl(employeeID,Validators.required),
      'employeeName': new FormControl(employeeName,Validators.required),
      'employeePhone': new FormControl(employeePhone,Validators.required),
      'employeeGender': new FormControl(employeeGender),
      'employeeMail': new FormControl(employeeMail),
      'employeeDOB': new FormControl(employeeDOB)
    });
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
  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: '!שגיאה',
      message: errorMessage,
      buttons: ['חזרה']
    });
    alert.present();

  }
  onDeleteEmployee() {
    const alert=this.alertCtrl.create({
      title:'!אזהרה',
      message:'?האם הינך בטוח שברצונך למחוק',
      buttons:[{text:'ביטול'},{
        text:'אישור',
        handler:data=>{
          this.empService.removeItem(this.index);
          this.saveEmployees();
          this.ionViewDidLoad();
          this.successWindow("עובד נמחק בהצלחה");
          this.navCtrl.popToRoot();
        }
      }],
      cssClass:"alertDanger"
    });
    alert.present();
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
  private successWindow(success:string){
    const alert = this.alertCtrl.create({
      message: success,
      buttons: ['חזרה']
    });
    alert.present();
  }
}
