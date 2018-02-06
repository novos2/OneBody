import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Homescreen } from './homescreen';

@NgModule({
  declarations: [
    Homescreen,
  ],
  imports: [
    IonicPageModule.forChild(Homescreen),
  ],
  exports: [
    Homescreen
  ]
})
export class HomescreenModule {}
