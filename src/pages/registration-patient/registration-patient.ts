import { Component } from '@angular/core';
import { IonicPage} from 'ionic-angular';
import {PatientService} from "../../services/patient";
import { NgForm } from "@angular/forms";
@IonicPage()
@Component({
  selector: 'page-registration-patient',
  templateUrl: 'registration-patient.html',
})
export class RegistrationPatient {



  selectOptions = ["זכר", "נקבה"];

  constructor(private pService:PatientService) {
  }
  onAddPatient(form: NgForm) {
    this.pService.addItem(form.value.patientID, form.value.patientFirstName,form.value.patientLastName,form.value.gender,form.value.patientAddress,form.value.patientPhone,
    form.value.patientMail,form.value.patientDOB);
    form.reset();
    /*this.loadItems();*/
  }


}
