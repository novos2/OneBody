import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Treatments } from './treatments';

@NgModule({
  declarations: [
    Treatments,
  ],
  imports: [
    IonicPageModule.forChild(Treatments),
  ],
})
export class TreatmentsModule {}
