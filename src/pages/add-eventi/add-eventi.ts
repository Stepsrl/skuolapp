import { DataProvider } from './../../providers/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-add-eventi',
  templateUrl: 'add-eventi.html',
})
export class AddEventiPage {

  title: String;
  date: String;
  hour: String;
  costo: String;
  buttonTitle: String = "Aggiungi";

  private mySchool;
  private eventoDaModificare;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataProvider : DataProvider ) {
  }


  ionViewDidLoad() {
    this.mySchool = this.navParams.data.scuola;
    this.eventoDaModificare = this.navParams.data.event
    
    if (this.eventoDaModificare != null) {
      this.title = this.eventoDaModificare.titolo
      this.date = this.eventoDaModificare.data
      this.hour = this.eventoDaModificare.ora
      this.costo = this.eventoDaModificare.costo
      this.buttonTitle = "Modifica"
    } else {
      this.buttonTitle = "Aggiungi" 
    }
  }


  saveEvent(){
    let newEvento = { "titolo": this.title.toString(), 
                       "data": this.date.toString(), 
                       "ora": this.hour.toString(),
                       "costo": this.costo.toString()
    };
    
    if (this.eventoDaModificare != null) {
      if (
           newEvento.titolo == this.eventoDaModificare.titolo
        && newEvento.data == this.eventoDaModificare.data
        && newEvento.ora == this.eventoDaModificare.ora
        && newEvento.costo == this.eventoDaModificare.costo
        ) {
          return
        }

      this.dataProvider.getNewsForClassObject("Eventi", this.mySchool.scuola.codice_scuola, this.mySchool.classe.id, this.eventoDaModificare.key)
      .update(newEvento);
      this.navCtrl.pop();
      
      return
    }

    this.dataProvider.getNewsForClassList("Eventi", this.mySchool.scuola.codice_scuola, this.mySchool.classe.id)
      .push(newEvento);

    this.dataProvider.saveNewsLocal("Eventi", this.mySchool.classe.id, JSON.stringify(newEvento));
    this.navCtrl.pop();
    }
}
