import { Component } from '@angular/core';
import { IonicPage} from 'ionic-angular';
import {RegistrationPatient} from '../registration-patient/registration-patient';

import {RegistrationEmployee} from "../registration-employee/registration-employee";
import {Homescreen} from "../homescreen/homescreen";


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class Tabs {

  patientPage = RegistrationPatient;
  homePage = Homescreen;
  employeesPage = RegistrationEmployee;


}
