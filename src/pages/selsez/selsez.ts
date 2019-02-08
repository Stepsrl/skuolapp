import { Component , ViewChild} from '@angular/core';
import {  NavController, NavParams, Content } from 'ionic-angular';

/**
 * Generated class for the SelsezPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

import { SelclassePage } from '../selclasse/selclasse';
//import { SelindPage } from '../selind/selind';
export class Dato {
  id: string;
  nome: string;
}
@Component({
  selector: 'page-selsez',
  templateUrl: 'selsez.html',
})
export class SelsezPage {
  @ViewChild(Content) content: Content;
  private myscool:any;
  private messaggio:string;

  private list : any;
  private item:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelsezPage');
  }

  ionViewWillEnter() {
    this.content.resize();
    this.myscool = this.navParams.data.scuola;
    this.item = this.navParams.data.item;
    //console.log("scuola:"+JSON.stringify(this.myscool));
    //console.log("item:"+JSON.stringify(this.item));
    this.messaggio = "";
    this.getScuola();
  }

  getScuola(){
    this.list = [];
    if (this.item.sezioni){
      this.list = this.item.sezioni;
    }

  }

  goClasse(item){
    //console.log("item:"+JSON.stringify(item));
    let indirizzo: Dato;
    indirizzo = new Dato;
    indirizzo.id = item.id;
    indirizzo.nome = item.nome;
    this.myscool.sezione = indirizzo;
    this.navCtrl.push(SelclassePage, {"scuola": this.myscool, "item": item});
  }


}
