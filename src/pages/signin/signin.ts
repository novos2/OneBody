import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { LoadingController, AlertController } from "ionic-angular";

import { AuthService } from "../../services/auth";

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class Signin {

  constructor(private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {
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
          title: 'התחברות נכשלה!',
          message: error.message,
          buttons: ['חזרה']
        });
        alert.present();
      });
  }
}
