import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Patients } from './patients';

@NgModule({
  declarations: [
    Patients,
  ],
  imports: [
    IonicPageModule.forChild(Patients),
  ],
  exports: [
    Patients
  ]
})
export class PatientsModule {}
