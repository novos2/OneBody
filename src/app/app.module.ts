import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import {RegistrationPatient} from '../pages/registration-patient/registration-patient';
import {Tabs} from '../pages/tabs/tabs';
import {Marketing} from '../pages/marketing/marketing';
import {Employees} from '../pages/employees/employees';
import {Signin} from '../pages/signin/signin';
import { AuthService } from "../services/auth";
import  {PatientService} from "../services/patient";
import {Signup} from '../pages/signup/signup';



@NgModule({
  declarations: [
    MyApp,
    RegistrationPatient,
    Tabs,
    Marketing,
    Employees,
    Signin,
    Signup
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    RegistrationPatient,

    Tabs,
    Marketing,
    Employees,

    Signin,
    Signup
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    PatientService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
