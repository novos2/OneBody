import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Marketing } from './marketing';

@NgModule({
  declarations: [
    Marketing,
  ],
  imports: [
    IonicPageModule.forChild(Marketing),
  ],
  exports: [
    Marketing
  ]
})
export class MarketingModule {}
