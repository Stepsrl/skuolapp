import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import {Http} from '@angular/http';

import { SelCountryPage } from '../selcountry/selcountry';

/**
 * Generated class for the SelelezPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-selelez',
  templateUrl: 'selelez.html',
})
export class SelelezPage {
  private eleactivelists: any;
  private elelists: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelelezPage');
    this.getLocalData();
  }

  ionViewWillEnter(){
    this.getLocalData();
  }
  getLocalData() {
//    this.http.get('../assets/mock/regioni.json').map(res => res.json()).subscribe(data => {

      this.http.get('assets/mock/regioni.json').map(res => res.json()).subscribe(data => {
      // console.log(data.regioni);
      //this.reglists= data.regioni;
      this.elelists= data.elezioni;
      // console.log(this.reglists);
      this.getEleActive();
    });

  }
  getEleActive(){
    //console.log(JSON.stringify(this.reglists));
    //console.log("attivi:"+this.reglists);

    this.eleactivelists=[];
    this.elelists.forEach( r => { console.log("elem:"+r)
      if (r.active=='S'){
        this.eleactivelists.push(r);
        // console.log("attivo:"+r)
      }
    });


  }
  goCountry(codice){
    //console.log("seleziona:"+codice);
    this.navCtrl.push(SelCountryPage, {"code": codice});
  }

}
