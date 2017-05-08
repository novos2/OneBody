import { Component } from '@angular/core';
import { IonicPage} from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-registration-patient',
  templateUrl: 'registration-patient.html',
})
export class RegistrationPatient {



  selectOptions = ['זכר', 'נקבה'];

  constructor() {
  }



}
