import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import {LoadingController, AlertController, NavController} from "ionic-angular";

import { AuthService } from "../../services/auth";
import {Signup} from "../signup/signup";

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class Signin {

  constructor(private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public navCtrl: NavController) {
  }

  onSignin(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: '...מתחבר'
    });
    loading.present();
    this.authService.signin(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: '!התחברות נכשלה',
          message: error.message,
          buttons: ['חזרה']
        });
        alert.present();
      });
  }

  createAccount(){
    this.navCtrl.push(Signup);
  }
  forgotPassCtrl(){
    const alert=this.alertCtrl.create({
      title:'שכחתי סיסמא',
      message:'אנא הכנס כתובת מייל לאיפוס סיסמא',
      inputs:[{name:'mail',placeholder:'הכנס כאן'}],
      buttons:[{
        text:'ביטול'
      },
        {text:'שליחה',
          handler:data=>{
          this.authService.forgotPass(data.mail).then(data=>{
            const alert=this.alertCtrl.create({
              title:'מייל נשלח בהצלחה',
              message:'הנחיות לאיפוס סיסמא נשלחו לכתובת המייל שהוזנה',
              buttons:['חזרה']
            });
            alert.present();
          })
            .catch(error=>{
            const alert=this.alertCtrl.create({
              title:'!שגיאה',
              message:error.message,
              buttons:['חזרה']
            });
            alert.present();
          });
          }

        }]
    });
    alert.present();
  }

  /*forgotPassCtrl(){
    const alert=this.alertCtrl.create(({
      title:'שכחתי סיסמא',
      message:'הכנס כתובת מייל לאיפוס סיסמא',
      inputs:[{name:'mail',placeholder:'הכנס כאן'}],
      buttons:[{
        text:'ביטול'
      },
        {text:'שליחה',
          handler:data=>{
            if(this.authService.forgotPass(data.mail)){
              const alert= this.alertCtrl.create({
                title:'מייל נשלח בהצלחה',
                message:'הנחיות לאיפוס סיסמא נשלחו לכתובת המייל שהוזנה',
                buttons:['חזרה']
              });
              alert.present();
            }
            else{
              const alert=this.alertCtrl.create({
                title:'!שגיאה',
                message:'כתובת מייל שהוזנה אינה חוקית או אינה קיימת במערכת',
                buttons:['חזרה']
              });
              alert.present();
            }
          }}]
    }));
    alert.present();
  }*/
}
