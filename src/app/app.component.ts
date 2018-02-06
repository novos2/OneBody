import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';

/*import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';*/


import { Tabs } from "../pages/tabs/tabs";
import { Signin } from "../pages/signin/signin";
import { Signup } from "../pages/signup/signup";
import { AuthService } from "../services/auth";
import firebase from 'firebase';
import {RegistrationPatient} from "../pages/registration-patient/registration-patient";
import {Marketing} from "../pages/marketing/marketing";
import {RegistrationEmployee} from "../pages/registration-employee/registration-employee";



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any ;//= Tabs;
  signinPage = Signin;
  signupPage = Signup;
  patientPage=RegistrationPatient;
  marketingPage=Marketing;
  employeesPage=RegistrationEmployee;
  isAuthenticated = false;
  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform,
              private menuCtrl: MenuController,
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
}
