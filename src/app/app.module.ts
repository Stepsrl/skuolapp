import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MessagesPage } from '../pages/messages/messages';
import { GroupsPage } from '../pages/groups/groups';
import { FriendsPage } from '../pages/friends/friends';
import { MessagePage } from '../pages/message/message';
import { GroupPage } from '../pages/group/group';
import { GroupInfoPage } from '../pages/group-info/group-info';
import { NewGroupPage } from '../pages/new-group/new-group';
import { AddMembersPage } from '../pages/add-members/add-members';

import { LoginProvider } from '../providers/login';
import { LogoutProvider } from '../providers/logout';
import { LoadingProvider } from '../providers/loading';
import { AlertProvider } from '../providers/alert';
import { ImageProvider } from '../providers/image';
import { DataProvider } from '../providers/data';
import { FirebaseProvider } from '../providers/firebase';

import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { Settings } from '../settings';

import { FriendPipe } from '../pipes/friend';
import { SearchPipe } from '../pipes/search';
import { ConversationPipe } from '../pipes/conversation';
import { DateFormatPipe } from '../pipes/date';
import { DateFormatImpurePipe } from '../pipes/dateImpure';
import { GroupPipe } from '../pipes/group';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GooglePlus } from '@ionic-native/google-plus';
import { Camera } from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/keyboard';
import { Contacts } from '@ionic-native/contacts';
import { MediaCapture } from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import { Firebase } from '@ionic-native/firebase';
import { Facebook } from '@ionic-native/facebook';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { HometabPage } from '../pages/hometab/hometab';
import { ComtabPage } from '../pages/comtab/comtab';
import { ComemptyPage } from '../pages/comempty/comempty';
import { ComlistPage } from '../pages/comlist/comlist';
import { FirstproviderProvider } from '../providers/firstprovider/firstprovider';
import { AccounttabPage } from '../pages/accounttab/accounttab';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {FireauthProvider} from "../providers/fireauth/fireauth";
import { MenuclassePage } from '../pages/menuclasse/menuclasse';

import { AlunniPage } from '../pages/alunni/alunni';
import { GenitoriPage } from '../pages/genitori/genitori';
import { ComunicaPage } from '../pages/comunica/comunica';
import { EventiPage } from '../pages/eventi/eventi';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AboutPage } from '../pages/about/about';
import { ProfilePage } from '../pages/profile/profile';
import { SelelezPage } from '../pages/selelez/selelez';
import { SelCountryPage } from '../pages/selcountry/selcountry';
import { SelprovPage } from '../pages/selprov/selprov';
import { SelCityPage } from '../pages/selcity/selcity';
import { SelscuolaPage } from '../pages/selscuola/selscuola';
import { SelindPage } from '../pages/selind/selind';
import { SelsezPage } from '../pages/selsez/selsez';
import { SelclassePage } from '../pages/selclasse/selclasse';

import { ListaEventiPage } from '../pages/lista-eventi/lista-eventi';
import { AddEventiPage } from '../pages/add-eventi/add-eventi';
import { ListaComunicazioniPage } from '../pages/lista-comunicazioni/lista-comunicazioni';
import { AddComunicazioniPage } from '../pages/add-comunicazioni/add-comunicazioni';
import { EventDocentInfoPage } from '../pages/event-docent-info/event-docent-info';
import { ComunicationDocentInfoPage } from '../pages/comunication-docent-info/comunication-docent-info';


firebase.initializeApp(Settings.firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    TabsPage,
    MessagesPage,
    GroupsPage,
    GroupInfoPage,
    FriendsPage,
    MessagePage,
    GroupPage,
    NewGroupPage,
    AddMembersPage,
    FriendPipe,
    ConversationPipe,
    SearchPipe,
    DateFormatPipe,
    DateFormatImpurePipe,
    GroupPipe,
      HometabPage,
      ComtabPage,
      ComemptyPage,
      ComlistPage,
      AccounttabPage,
      MenuclassePage,
      AlunniPage,
      GenitoriPage,
      ComunicaPage,
      AboutPage,
      ProfilePage,
      SelelezPage,
      SelCountryPage,
      SelprovPage,
      SelCityPage,
      SelscuolaPage,
      SelindPage,
      SelsezPage,
      SelclassePage,
      EventiPage,
      ListaEventiPage,
      AddEventiPage,
      ListaComunicazioniPage,
      AddComunicazioniPage,
      EventDocentInfoPage,
      ComunicationDocentInfoPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false,
      mode: 'ios',
      tabsPlacement: 'bottom'
    }),
    BrowserModule,
    AngularFireModule.initializeApp(Settings.firebaseConfig,'ionic3chat'),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    TabsPage,
    MessagesPage,
    GroupsPage,
    FriendsPage,
    MessagePage,
    GroupPage,
    GroupInfoPage,
    NewGroupPage,
    AddMembersPage,
      HometabPage,
      ComtabPage,
      ComemptyPage,
      ComlistPage,
      AccounttabPage,
      MenuclassePage,
      AlunniPage,
      GenitoriPage,
      ComunicaPage,
      AboutPage,
      ProfilePage,
      SelelezPage,
      SelCountryPage,
      SelprovPage,
      SelCityPage,
      SelscuolaPage,
      SelindPage,
      SelsezPage,
      SelclassePage,
      EventiPage,
      ListaEventiPage,
      AddEventiPage,
      ListaComunicazioniPage,
      AddComunicazioniPage,
      EventDocentInfoPage,
      ComunicationDocentInfoPage      
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler },
    SplashScreen,
    StatusBar,
    GooglePlus,
    Camera,
    Keyboard,
    Contacts,
    MediaCapture,
    File,
    Geolocation,
    Firebase,
    Facebook,
    LoginProvider,
    LogoutProvider,
    LoadingProvider,
    AlertProvider,
    ImageProvider,
    DataProvider,
    FirebaseProvider,
      FirstproviderProvider,
      InAppBrowser,
      SocialSharing,
      FireauthProvider
  ]
})
export class AppModule { }
