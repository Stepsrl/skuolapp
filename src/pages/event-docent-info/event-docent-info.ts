import { DataProvider } from './../../providers/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';

/**
 * Generated class for the EventDocentInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-docent-info',
  templateUrl: 'event-docent-info.html',
})
export class EventDocentInfoPage {
  private mySchool;  
  evento;

  eventiConfermati : Observable<any>;
  eventiNonConfermati : Observable<any>;


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataProvider : DataProvider) {
    this.mySchool = this.navParams.data.scuola;
    this.evento = this.navParams.data.event
  }

  ionViewDidLoad() {    
    this.eventiConfermati = this.dataProvider.getConfirmedPartecipantsList("Eventi", this.mySchool.scuola.codice_scuola, this.mySchool.classe.id, this.evento.key)
      .snapshotChanges()
      .map(request => request.map(c => ({
        genitoreKey: c.key,
        ...c.payload.val()
      })));
      
      this.eventiNonConfermati = this.dataProvider.getNotConfirmedPartecipantsList("Eventi", this.mySchool.scuola.codice_scuola, this.mySchool.classe.id, this.evento.key)
      .snapshotChanges()
      .map(request => request.map(c => ({
        genitoreKey: c.key,
        ...c.payload.val()
      })));
  }

}
