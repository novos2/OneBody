import { Component, ViewChild } from '@angular/core';
import {Platform, NavController, MenuController, AlertController} from 'ionic-angular';
import { Tabs } from "../pages/tabs/tabs";
import { Signin } from "../pages/signin/signin";
import { Signup } from "../pages/signup/signup";
import { AuthService } from "../services/auth";
import firebase from 'firebase';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any ;//= Tabs;
  signinPage = Signin;
  signupPage = Signup;
  isAuthenticated = false;
  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform,
              private menuCtrl: MenuController,
              private alertCtrl:AlertController,
              private authService: AuthService
            ) {
    firebase.initializeApp({
      apiKey: "AIzaSyAlTIahEGebMx8an7qXa4LZmSFUTSGhzIc",
      authDomain: "onebody-356cf.firebaseapp.com"
    });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.isAuthenticated = true;
        this.rootPage = Tabs;
      } else {
        this.isAuthenticated = false;
        this.rootPage = Signin;
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      /*StatusBar.styleDefault();
      SplashScreen.hide();*/
    });
  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout() {
    this.authService.logout();
    this.menuCtrl.close();
    this.nav.setRoot(Signin);
  }
  onAbout() {
    let alert = this.alertCtrl.create({
      title: 'אודות',
      message: '<p><h5 > מערכת One Body פותחה במסגרת פרויקט גמר בתואר ראשון בחוג למערכות מידע באוניברסיטת חיפה.</h5></p><br><p><h5 > כל הזכויות שמורות למפתחי המערכת: דימה ברוכין ועמית נובומינסקי 2018&copy; </h5></p>',
      buttons: ['אישור'],
      cssClass: 'rtlAlert'
    });
    alert.present();
    this.menuCtrl.close();
  }
}
