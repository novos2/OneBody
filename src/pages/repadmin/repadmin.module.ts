import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Repadmin } from './repadmin';

@NgModule({
  declarations: [
    Repadmin,
  ],
  imports: [
    IonicPageModule.forChild(Repadmin),
  ],
})
export class RepadminModule {}
