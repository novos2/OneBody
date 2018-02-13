import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditpatientPage } from './editpatient';

@NgModule({
  declarations: [
    EditpatientPage,
  ],
  imports: [
    IonicPageModule.forChild(EditpatientPage),
  ],
})
export class EditpatientPageModule {}
