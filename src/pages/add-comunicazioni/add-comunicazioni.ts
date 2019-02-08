import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data';

/**
 * Generated class for the AddComunicazioniPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-comunicazioni',
  templateUrl: 'add-comunicazioni.html',
})
export class AddComunicazioniPage {
  title: String;
  date: String;
  comunicazione: String;
  buttonTitle: String = "Aggiungi";

  private mySchool;
  private comunicazioneDaModificare;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataProvider : DataProvider ) {
  }


  ionViewDidLoad() {
    this.mySchool = this.navParams.data.scuola;
    this.comunicazioneDaModificare = this.navParams.data.comunicazione
    
    if (this.comunicazioneDaModificare != null) {
      this.title = this.comunicazioneDaModificare.titolo
      this.date = this.comunicazioneDaModificare.data
      this.comunicazione = this.comunicazioneDaModificare.comunicazione
      this.buttonTitle = "Modifica"
    } else {
      this.buttonTitle = "Aggiungi" 
    }
  }


  saveComunication(){
    let dataComunicazione = { "titolo": this.title.toString(), 
                              "data": this.date.toString(),
                              "comunicazione": this.comunicazione.toString() };

    if (this.comunicazioneDaModificare != null) {
      if (
           dataComunicazione.titolo == this.comunicazioneDaModificare.titolo
        && dataComunicazione.data == this.comunicazioneDaModificare.data
        && dataComunicazione.comunicazione == this.comunicazioneDaModificare.comunicazione
        ) {
          return
        }  
        
      this.dataProvider.getNewsForClassObject("Comunicazioni", this.mySchool.scuola.codice_scuola, this.mySchool.classe.id, this.comunicazioneDaModificare.key)
      .update(dataComunicazione);
      this.navCtrl.pop();
      
      return
    }                        

    this.dataProvider.getNewsForClassList("Comunicazioni", this.mySchool.scuola.codice_scuola, this.mySchool.classe.id)      
    .push(dataComunicazione);

    this.dataProvider.saveNewsLocal("Comunicazioni",this.mySchool.classe.id, JSON.stringify(dataComunicazione));
    this.navCtrl.pop();
    }

}
