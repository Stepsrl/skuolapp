import { Component , ViewChild} from '@angular/core';
import {  NavController, NavParams , Content} from 'ionic-angular';

/**
 * Generated class for the EventiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-eventi',
  templateUrl: 'eventi.html',
})
export class EventiPage {
  @ViewChild(Content) content: Content;
  private myscool: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventiPage');
  }
  ionViewWillEnter() {
    this.content.resize();
    this.myscool = this.navParams.data.scuola;


    console.log("classe:"+JSON.stringify(this.myscool));
  }
}
