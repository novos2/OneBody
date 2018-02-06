import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavParams,NavController} from 'ionic-angular';
import {Employee} from "../../models/employee";
import {EmployeeService} from "../../services/employee";
import {AuthService} from "../../services/auth";


@IonicPage()
@Component({
  selector: 'page-employees',
  templateUrl: 'employees.html',
})
export class Employees implements OnInit {
  flag:boolean;
  listItems: Employee[];
  employee: Employee;
  index: number;
  constructor(public navParams: NavParams,
              private empService: EmployeeService,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navCtrl:NavController) {
    this.flag=false;
  }
  ngOnInit() {
    this.employee = this.navParams.get('employee');
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
    console.log('ionViewDidLoad Employees');
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
          this.saveList();
          this.ionViewDidLoad();
          this.successWindow("עובד נמחק בהצלחה");
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
          this.empService.fetchList(token)
            .subscribe(
              (list: Employee[]) => {
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

  private saveList(){
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
  private isAdmin(){
    return this.authService.isAdmin;
  }
}
