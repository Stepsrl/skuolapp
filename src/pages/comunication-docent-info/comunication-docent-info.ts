import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { DataProvider } from '../../providers/data';

@IonicPage()
@Component({
  selector: 'page-comunication-docent-info',
  templateUrl: 'comunication-docent-info.html',
})
export class ComunicationDocentInfoPage {
  private mySchool;  
  comunicazione;

  comunicazioniConfermate : Observable<any>;


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataProvider : DataProvider) {
    this.mySchool = this.navParams.data.scuola;
    this.comunicazione = this.navParams.data.comunicazione
  }

  ionViewDidLoad() {    
    this.comunicazioniConfermate = this.dataProvider.getConfirmedPartecipantsList("Comunicazioni", this.mySchool.scuola.codice_scuola, this.mySchool.classe.id, this.comunicazione.key)
      .snapshotChanges()
      .map(request => request.map(c => ({ genitoreKey: c.key, ...c.payload.val() })));
  }

}
