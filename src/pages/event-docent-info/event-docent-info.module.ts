import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventDocentInfoPage } from './event-docent-info';

@NgModule({
  declarations: [
    EventDocentInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(EventDocentInfoPage),
  ],
})
export class EventDocentInfoPageModule {}
