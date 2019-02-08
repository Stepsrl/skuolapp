import { EventDocentInfoPage } from './../event-docent-info/event-docent-info';
import { DataProvider } from './../../providers/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AddEventiPage } from '../add-eventi/add-eventi';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';


/**
 * Generated class for the ListaEventiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-eventi',
  templateUrl: 'lista-eventi.html',
})
export class ListaEventiPage {

  eventi : Observable<any>;
  uid;
  uidDocente;  
  private mySchool;
  isDisabled = false;
  colorTrue = false;
  colorFalse = false;


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataProvider : DataProvider, private alertCtrl: AlertController) {
    this.uid = firebase.auth().currentUser.uid;
    this.uidDocente = this.uid.startsWith("DDD-");
  }


  ionViewDidLoad() {
    this.mySchool = this.navParams.data.scuola;

    this.eventi = this.dataProvider.getEventsForClassList(this.mySchool.scuola.codice_scuola, this.mySchool.classe.id).snapshotChanges().
        map(request => request.map(c => {
          let metadati = JSON.parse(localStorage.getItem(c.key));
          if(metadati){
            return ({ key: c.key, ...c.payload.val(), conferma : metadati.conferma, disabilita : metadati.disabilita});
          }
          return ({ key: c.key, ...c.payload.val(), conferma: 0, disabilita: false});
        })
        );
  }

  addEvento(){
    this.navCtrl.push(AddEventiPage,{"scuola": this.mySchool});
  }
  onCardTap(evento) {
    if (this.uidDocente) {
      this.navCtrl.push(EventDocentInfoPage,{"scuola": this.mySchool, "event": evento});
    } else {
     //handle genitore tap
    }
  }

  tappedTrash(evento){
    this.alertCtrl.create({
      title: "Eliminare " + evento.titolo + "?",
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
            let nodoDaEliminare = this.dataProvider.getEventsForClassList(this.mySchool.scuola.codice_scuola, this.mySchool.classe.id)
            nodoDaEliminare.remove(evento.key);
          }
        }
      ]
    }).present();
  }
  tappedEdit(evento){
    this.navCtrl.push(AddEventiPage,{"scuola": this.mySchool, "event": evento});
  }

  partecipaEvento(bool : boolean, evento){
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
      "conferma" : evento.conferma,
      "disabilita" : evento.disabilita
    }
    
    localStorage.setItem(evento.key,JSON.stringify(metadati));

    if(bool)
      this.dataProvider.getStudentParticipationForClassObject("Eventi", this.mySchool.scuola.codice_scuola, this.mySchool.classe.id, evento.key, "Confirmed" )
        .set(partecipazione);
    else
      this.dataProvider.getStudentParticipationForClassObject("Eventi", this.mySchool.scuola.codice_scuola, this.mySchool.classe.id, evento.key, "NotConfirmed" )
        .set(partecipazione);
  }
}
