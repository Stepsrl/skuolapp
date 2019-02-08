import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaComunicazioniPage } from './lista-comunicazioni';

@NgModule({
  declarations: [
    ListaComunicazioniPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaComunicazioniPage),
  ],
})
export class ListaComunicazioniPageModule {}
