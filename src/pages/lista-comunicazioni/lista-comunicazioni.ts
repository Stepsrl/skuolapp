import { DataProvider } from './../../providers/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AddComunicazioniPage } from '../add-comunicazioni/add-comunicazioni';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { ComunicationDocentInfoPage } from '../comunication-docent-info/comunication-docent-info';

/**
 * Generated class for the ListaComunicazioniPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-comunicazioni',
  templateUrl: 'lista-comunicazioni.html',
})
export class ListaComunicazioniPage {

  comunicazioni : Observable<any>;
  private mySchool;
  uid;
  uidDocente;
  isDisabled = false;
  colorTrue = false;
  colorFalse = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataProvider : DataProvider, private alertCtrl: AlertController) {
    this.uid = firebase.auth().currentUser.uid;
    this.uidDocente = this.uid.startsWith("DDD-");
  }

  ionViewDidLoad() {
    this.mySchool = this.navParams.data.scuola;
    this.comunicazioni = this.dataProvider.getComunicationsForClassList(this.mySchool.scuola.codice_scuola, this.mySchool.classe.id).snapshotChanges().
    map(request => request.map(c => {
      let metadati = JSON.parse(localStorage.getItem(c.key));
      if(metadati){
        return ({ key: c.key, ...c.payload.val(), conferma : metadati.conferma, disabilita : metadati.disabilita});
      }
      return ({ key: c.key, ...c.payload.val(), conferma: 0, disabilita: false});
    })
    );
  }

  addComunicazione(){
    this.navCtrl.push(AddComunicazioniPage,{"scuola": this.mySchool});
  }

  onCardTap(comunicazione) {
    if (this.uidDocente) {
      this.navCtrl.push(ComunicationDocentInfoPage,{"scuola": this.mySchool, "comunicazione": comunicazione});
    } else {
     //handle genitore tap
    }
  }

  tappedTrash(comunicazione){
    this.alertCtrl.create({
      title: "Eliminare " + comunicazione.titolo + "?",
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: data => { }
        },
        {
          text: 'Si',
          role: 'destructive',
          handler: () => {
            let nodoDaEliminare = this.dataProvider.getComunicationsForClassList(this.mySchool.scuola.codice_scuola, this.mySchool.classe.id)
            nodoDaEliminare.remove(comunicazione.key);
          }
        }
      ]
    }).present();
  }

  tappedEdit(comunicazione){
    this.navCtrl.push(AddComunicazioniPage,{"scuola": this.mySchool, "comunicazione": comunicazione});
  }

  partecipaEvento(bool : boolean, comunicazione){
    let studente;
    let genitore = localStorage.getItem(this.uid);
    let studentsList = JSON.parse(localStorage.getItem(this.uid + '-Studenti'));

    for(let studentIndex in studentsList){
        let student = JSON.parse(studentsList[studentIndex]);
        if(student.classe == this.mySchool.classe.id)
          studente = student.nome;
    }

    let partecipazione = {
      "nome_genitore" : genitore,
      "nome_studente" : studente,
      "data" : new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
    }

    let metadati = {
      "conferma" : comunicazione.conferma,
      "disabilita" : comunicazione.disabilita
    }
    
    localStorage.setItem(comunicazione.key,JSON.stringify(metadati));

    if(bool)
      this.dataProvider.getStudentParticipationForClassObject("Comunicazioni", this.mySchool.scuola.codice_scuola, this.mySchool.classe.id, comunicazione.key, "Confirmed" )
        .set(partecipazione);
    else
      this.dataProvider.getStudentParticipationForClassObject("Comunicazioni", this.mySchool.scuola.codice_scuola, this.mySchool.classe.id, comunicazione.key, "NotConfirmed" )
        .set(partecipazione);
  }
}
