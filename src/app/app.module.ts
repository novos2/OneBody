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
import {RegistrationEmployee} from "../pages/registration-employee/registration-employee";
import {EmployeeService} from "../services/employee";
import {Patients} from "../pages/patients/patients";



@NgModule({
  declarations: [
    MyApp,
    RegistrationPatient,
    RegistrationEmployee,
    Tabs,
    Marketing,
    Employees,
    Patients,
    Signin,
    Signup
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: 'חזרה'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    RegistrationPatient,
    RegistrationEmployee,
    Tabs,
    Marketing,
    Employees,
    Patients,
    Signin,
    Signup
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    PatientService,
    EmployeeService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
