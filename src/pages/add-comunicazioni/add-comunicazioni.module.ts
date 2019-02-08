import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddComunicazioniPage } from './add-comunicazioni';

@NgModule({
  declarations: [
    AddComunicazioniPage,
  ],
  imports: [
    IonicPageModule.forChild(AddComunicazioniPage),
  ],
})
export class AddComunicazioniPageModule {}
