import { Component , ViewChild} from '@angular/core';
import {  NavController, NavParams , Content} from 'ionic-angular';

/**
 * Generated class for the ComunicaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-comunica',
  templateUrl: 'comunica.html',
})
export class ComunicaPage {
  @ViewChild(Content) content: Content;
  private myscool: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComunicaPage');
  }
  ionViewWillEnter() {
    this.content.resize();
    this.myscool = this.navParams.data.scuola;


    console.log("classe:"+JSON.stringify(this.myscool));
  }
}
