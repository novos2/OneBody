import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import {RegistrationPatient} from '../pages/registration-patient/registration-patient';
import {Tabs} from '../pages/tabs/tabs';
import {Marketing} from '../pages/marketing/marketing';
import {Employees} from '../pages/employees/employees';
/*import {SigninPage} from '../pages/signin/signin';
import {SignupPage} from '../pages/signup/signup';*/

@NgModule({
  declarations: [
    MyApp,
    RegistrationPatient,
    Tabs,
    Marketing,
    Employees
    /*SigninPage,
    SignupPage*/
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    RegistrationPatient,

    Tabs,
    Marketing,
    Employees

    /*SigninPage,
    SignupPage*/
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
