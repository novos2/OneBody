import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrationEmployee } from './registration-employee';

@NgModule({
  declarations: [
    RegistrationEmployee,
  ],
  imports: [
    IonicPageModule.forChild(RegistrationEmployee),
  ],
  exports: [
    RegistrationEmployee
  ]
})
export class RegistrationEmployeeModule {}
