import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

//Firebase base root
const root = '/Test_Scuole/';
const annoScolasticoCorrente = '2018_2019';

@Injectable()
export class DataProvider {
  // Data Provider
  // This is the provider class for most of the Firebase observables in the app.

  constructor(public angularfire: AngularFireDatabase) {
    console.log("Initializing Data Provider");
  }

  // Get all users
  getUsers() {
    return this.angularfire.list('/accounts', ref => ref.orderByChild('name'));
  }

  // Get user with username
  getUserWithUsername(username) {
    return this.angularfire.list('/accounts', ref => ref.orderByChild('username').equalTo(username));
  }

  // Get logged in user data
  getCurrentUser() {
    return this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid);
  }

  // Get logged in parent
  getCurrentParent(uid) {
    return this.angularfire.list(root + 'Users/Genitori/' + uid);
  }

  // Get logged in user data
  getCurrentClass(scuola) {
    return this.angularfire.object('/accounts/' + scuola.codice_scuola);
  }

  // Get user by their userId
  getUser(userId) {
    return this.angularfire.object('/accounts/' + userId);
  }

  // Get requests given the userId.
  getRequests(userId) {
    return this.angularfire.object('/requests/' + userId);
  }

  // Get friend requests given the userId.
  getFriendRequests(userId) {
    return this.angularfire.list('/requests', ref => ref.orderByChild('receiver').equalTo(userId));
  }

  // Get conversation given the conversationId.
  getConversation(conversationId) {
    return this.angularfire.object('/conversations/' + conversationId);
  }

  // Get conversations of the current logged in user.
  getConversations() {
    return this.angularfire.list('/accounts/' + firebase.auth().currentUser.uid + '/conversations');
  }

  // Get messages of the conversation given the Id.
  getConversationMessages(conversationId) {
    return this.angularfire.object('/conversations/' + conversationId + '/messages');
  }

  // Get messages of the group given the Id.
  getGroupMessages(groupId) {
    return this.angularfire.object('/groups/' + groupId + '/messages');
  }

  // Get groups of the logged in user.
  getGroups() {
    return this.angularfire.list('/accounts/' + firebase.auth().currentUser.uid + '/groups');
  }

  // Get group info given the groupId.
  getGroup(groupId) {
    return this.angularfire.object('/groups/' + groupId);
  }

  getBlockedLists() {
    return this.angularfire.list('/accounts/' + firebase.auth().currentUser.uid + '/conversations', ref => ref.orderByChild('blocked').equalTo(true));
  }


  //
  getPendigRequests(codice_scuola, id_classe) {
    return this.angularfire.list(root + '/Scuole/' + codice_scuola + '/' + id_classe + '/Richieste/Pending');
  }
  getPendigRequestObj(codice_scuola, id_classe, id_genitore) {
    return this.angularfire.object(root + 'Scuole/' + codice_scuola + '/' + id_classe + '/Richieste/Pending/' + id_genitore);
  }
  //getPendigRequestList(codice_scuola, id_classe, id_genitore){    
  //    return this.angularfire.list( root + 'Scuole/' + codice_scuola + '/' + id_classe + '/Richieste/Pending/' + id_genitore);
  //}



  getConfirmedRequests(codice_scuola, id_classe) {
    return this.angularfire.list(root + '/Scuole/' + codice_scuola + '/' + id_classe + '/Richieste/Confirmed');
  }
  getConfirmedRequestObj(codice_scuola, id_classe, id_genitore) {
    return this.angularfire.object(root + 'Scuole/' + codice_scuola + '/' + id_classe + '/Richieste/Confirmed/' + id_genitore);
  }
  //getConfirmedRequestList(codice_scuola, id_classe, id_genitore){    
  //    return this.angularfire.list( root + 'Scuole/' + codice_scuola + '/' + id_classe + '/Richieste/Confirmed/' + id_genitore);
  //}

  //getUserGenitoreList(id_genitore) {
  //    return this.angularfire.list( root + 'Users/Genitori/' + id_genitore);
  //}
  getUserGenitoreClasseObj(id_genitore, id_classe) {
    return this.angularfire.object(root + 'Users/Genitori/' + id_genitore + "/" + id_classe);
  }

  //getVisibleClassesForParent(id_parent, id_student){    }
  //getPendingRequestsForParent(id_parent){    }
  //getAcceptedRequestsForParent(id_parent){    }

  getNewsForClassList(type, codice_scuola, id_classe) { //type: Eventi / Comunicazioni
    return this.angularfire.list(root + 'Scuole/' + codice_scuola + "/" + id_classe + "/" + type + "/" + annoScolasticoCorrente);
  }
  getNewsForClassObject(type, codice_scuola, id_classe, id_evento) { //type: Eventi / Comunicazioni
    return this.angularfire.object(root + 'Scuole/' + codice_scuola + "/" + id_classe + "/" + type + "/" + annoScolasticoCorrente + "/" + id_evento);
  }
  getStudentParticipationForClassObject(type, codice_scuola, id_classe, id_evento, participation) { //type: Eventi / Comunicazioni
    return this.angularfire.object(root + 'Scuole/' + codice_scuola + "/" + id_classe + "/" + type + "/" + annoScolasticoCorrente + "/" 
        + id_evento + "/" + participation + "/" + firebase.auth().currentUser.uid);
  }
  saveNewsLocal(type, id_classe, datiNews: String) {
    let localStorageKey = id_classe + "-" + type;
    let news = [];

    if (localStorage.getItem(localStorageKey)) {
      news = JSON.parse(localStorage.getItem(localStorageKey));
    }
    news.push(datiNews);
    localStorage.setItem(localStorageKey, JSON.stringify(news));

    console.log(JSON.parse(localStorage.getItem(localStorageKey)));
  }

  getEventsForClassList(codice_scuola, id_classe) {
    return this.angularfire.list(root + 'Scuole/' + codice_scuola + "/" + id_classe + "/Eventi/" + annoScolasticoCorrente);
  }
  //getEventForClassObject(codice_scuola, id_classe, codice_evento) {
  //  return this.angularfire.object(root + 'Scuole/' + codice_scuola + "/" + id_classe + "/Eventi/" + annoScolasticoCorrente + "/" + codice_evento);
  //}

  getComunicationsForClassList(codice_scuola, id_classe) {
    return this.angularfire.list(root + 'Scuole/' + codice_scuola + "/" + id_classe + "/Comunicazioni/" + annoScolasticoCorrente);
  }

  saveStudentLocalIfNotPresent(class_id: String, student_name: String) {
    let localStorageKey = firebase.auth().currentUser.uid + '-Studenti'
    let studentObject = {
      "classe": class_id,
      "nome": student_name
    }
    let listaStudenti = [];

    if (localStorage.getItem(localStorageKey)) {
      listaStudenti = JSON.parse(localStorage.getItem(localStorageKey));
      for (let studenteIndex in listaStudenti) {
        let std = JSON.parse(listaStudenti[studenteIndex])
        if (std.classe == class_id) {
          return
        }
      }
    }
    listaStudenti.push(JSON.stringify(studentObject))

    localStorage.setItem(localStorageKey, JSON.stringify(listaStudenti))
  }
  getStudentName(class_id) {
    let localStorageKey = firebase.auth().currentUser.uid + '-Studenti'

    let listaStudenti = [];
    listaStudenti = JSON.parse(localStorage.getItem(localStorageKey));
    if (!listaStudenti) {
      return null
    }

    let studente = null;

    for (let studenteIndex in listaStudenti) {
      let std = JSON.parse(listaStudenti[studenteIndex])
      if (std.classe == class_id) {
        studente = listaStudenti[studenteIndex]
        break
      }
    }

    return studente
  }

  getConfirmedPartecipantsList(type, codice_scuola, id_classe, id_evento) {
    return this.angularfire.list(root + 'Scuole/' + codice_scuola + "/" + id_classe + "/" + type + "/" + annoScolasticoCorrente + "/" 
    + id_evento + "/Confirmed/");
  }
  getNotConfirmedPartecipantsList(type, codice_scuola, id_classe, id_evento) {
    return this.angularfire.list(root + 'Scuole/' + codice_scuola + "/" + id_classe + "/" + type + "/" + annoScolasticoCorrente + "/" 
    + id_evento + "/NotConfirmed/");
  }

  getChatRoom(codice_scuola,id_classe,uid_Docente,uid_Genitore){
    return this.angularfire.list(root + 'Scuole/' + codice_scuola + "/" + id_classe + "/Docenti/" + uid_Docente + "/Stanze/" 
    + uid_Genitore);
  }

  getChatRoomRef(codice_scuola,id_classe,uid_Docente,uid_Genitore){
    return firebase.database().ref(root + 'Scuole/' + codice_scuola + "/" + id_classe + "/Docenti/" + uid_Docente + "/Stanze/" 
    + uid_Genitore);
  }

}
