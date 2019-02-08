import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, App } from 'ionic-angular';

import { AlunniPage } from '../alunni/alunni';
import { GenitoriPage } from '../genitori/genitori';
//import { GenitalunniPage } from '../genitalunni/genitalunni';
//import { ComunicaPage } from '../comunica/comunica';
//import { EventiPage } from '../eventi/eventi';
import { FriendsPage } from '../friends/friends';
import { MessagesPage } from '../messages/messages';
import { GroupsPage } from '../groups/groups';
import { ListaEventiPage } from '../lista-eventi/lista-eventi';
import { ListaComunicazioniPage } from '../lista-comunicazioni/lista-comunicazioni';
import * as firebase from "firebase";
import { DataProvider } from "../../providers/data";

/**
 * Generated class for the MenuclassePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-menuclasse',
  templateUrl: 'menuclasse.html',
})
export class MenuclassePage {
  @ViewChild(Content) content: Content;

  myscool: any;
  friendRequestCount: any;
  isDocente;
  private classe: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    this.myscool = this.navParams.data.scuola;
    //console.log("classe:"+JSON.stringify(this.myscool));
    this.classe = this.myscool.scuola.codice_scuola + '_' + this.myscool.indirizzo.id + '_' + this.myscool.sezione.id + '_' + this.myscool.classe.id;
    //this.dataProvider.getRequests(firebase.auth().currentUser.uid).snapshotChanges().subscribe((requestsRes) => {
    /*this.dataProvider.getRequests(this.classe).snapshotChanges().subscribe((requestsRes) => {
    let requests = requestsRes.payload.val();
    //console.log(requests);
    if (requests != null){
        if(requests.friendRequests != null && requests.friendRequests != undefined)
            this.friendRequestCount = requests.friendRequests.length;
        else this.friendRequestCount = 0
    }
    else this.friendRequestCount = 0;
    //console.log(this.friendRequestCount);
});*/
    this.dataProvider.getPendigRequests(this.myscool.scuola.codice_scuola, this.myscool.classe.id).snapshotChanges().subscribe((requestsRes) => {
      if (requestsRes)
        this.friendRequestCount = requestsRes.length;
      else
        this.friendRequestCount = 0;
    });
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter MenuclassePage');
    this.content.resize();
    this.myscool = this.navParams.data.scuola;


    // console.log("classe:"+JSON.stringify(this.myscool));
  }

  alunni() {
    this.navCtrl.push(AlunniPage, { "scuola": this.myscool });
  }

  comunicazioni() {
    this.navCtrl.push(ListaComunicazioniPage, { "scuola": this.myscool });
  }
  eventi() {
    this.navCtrl.push(ListaEventiPage, { "scuola": this.myscool });
  }
  genitori() {

    this.navCtrl.push(GenitoriPage, { "scuola": this.myscool });
  }


  friends() {
    this.navCtrl.push(FriendsPage);
  }

  messages() {
    this.navCtrl.push(MessagesPage);
  }

  groups() {
    this.navCtrl.push(GroupsPage);
  }
}
