import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrationPatient } from './registration-patient';

@NgModule({
  declarations: [
    RegistrationPatient,
  ],
  imports: [
    IonicPageModule.forChild(RegistrationPatient),
  ],
  exports: [
    RegistrationPatient
  ]
})
export class RegistrationPatientModule {}
