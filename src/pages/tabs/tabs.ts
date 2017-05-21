import { Component } from '@angular/core';
import { IonicPage} from 'ionic-angular';
import {RegistrationPatient} from '../registration-patient/registration-patient';
import {Marketing} from "../marketing/marketing";
import {Employees} from '../employees/employees';
import {RegistrationEmployee} from "../registration-employee/registration-employee";

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class Tabs {

  patientPage = RegistrationPatient;
  marketingPage = Marketing;
  employeesPage = RegistrationEmployee;


}
