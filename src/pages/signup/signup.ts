import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { LoadingController, AlertController } from "ionic-angular";

import { AuthService } from "../../services/auth";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class Signup {
  constructor(private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {
  }

  onSignup(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: '...נרשם'
    });
    loading.present();
    if(form.value.password!==form.value.passwordConfirmation){
      const alert = this.alertCtrl.create({
        title: '!רישום נכשל',
        message: 'סיסמאות לא תואמות',
        buttons: ['חזרה']
      });
      loading.dismiss();
      alert.present();
      form.reset();
    }
    else {
      this.authService.signup(form.value.email, form.value.password)
        .then(data => {
          loading.dismiss();
        })
        .catch(error => {
          loading.dismiss();
          const alert = this.alertCtrl.create({
            title: '!רישום נכשל',
            message: error.message,
            buttons: ['חזרה']
          });
          alert.present();
        });
    }
  }
}
