import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import {RegistrationPatient} from '../pages/registration-patient/registration-patient';
import {Tabs} from '../pages/tabs/tabs';
import {Employees} from '../pages/employees/employees';
import {Treatments} from '../pages/treatments/treatments';
import {Repadmin} from "../pages/repadmin/repadmin";
import {Signin} from '../pages/signin/signin';
import { AuthService } from "../services/auth";
import  {PatientService} from "../services/patient";
import {Signup} from '../pages/signup/signup';
import {RegistrationEmployee} from "../pages/registration-employee/registration-employee";
import {EmployeeService} from "../services/employee";
import {Patients} from "../pages/patients/patients";
import {CallNumber} from "@ionic-native/call-number";
import {Homescreen} from "../pages/homescreen/homescreen";
import {TreatmentService} from "../services/treatment";
import { SMS } from '@ionic-native/sms';
import { EditemployeePage} from "../pages/editemployee/editemployee";
import {EditpatientPage} from "../pages/editpatient/editpatient";
import {EdittreatmentPage} from "../pages/edittreatment/edittreatment";
@NgModule({
  declarations: [
    MyApp,
    RegistrationPatient,
    RegistrationEmployee,
    Tabs,
    EditemployeePage,
    EditpatientPage,
    EdittreatmentPage,
    Employees,
    Patients,
    Repadmin,
    Homescreen,
    Treatments,
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
    EditemployeePage,
    EditpatientPage,
    EdittreatmentPage,
    Employees,
    Repadmin,
    Treatments,
    Patients,
    Homescreen,
    Signin,
    Signup
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    PatientService,
    EmployeeService,
    TreatmentService,
    CallNumber,
    SMS,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
