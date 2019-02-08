import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddEventiPage } from './add-eventi';

@NgModule({
  declarations: [
    AddEventiPage,
  ],
  imports: [
    IonicPageModule.forChild(AddEventiPage),
  ],
})
export class AddEventiPageModule {}
