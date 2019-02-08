import { Component , ViewChild} from '@angular/core';
import { Content, NavController } from 'ionic-angular';
//import { BarlistsPage } from '../barlists/barlists';
import { AccounttabPage } from '../accounttab/accounttab';
//import { OrdinitabPage } from '../ordinitab/ordinitab';
//import { SelCountryPage } from '../selcountry/selcountry';
import { ComtabPage } from '../comtab/comtab';
/**
 * Generated class for the HometabPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-hometab',
  templateUrl: 'hometab.html'
})
export class HometabPage {
    @ViewChild(Content) content: Content;

 // barRoot = BartabPage
  //ordiniRoot = OrdinitabPage
  comRoot = ComtabPage
  infoRoot = AccounttabPage
 // accountRoot = BarlistsPage

  constructor(public navCtrl: NavController) {
    console.log("HometabPage");
  }


}
