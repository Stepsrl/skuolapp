//import { TabsPage } from './pages/tabs/tabs';
import { HometabPage } from './pages/hometab/hometab';
export namespace Settings {

    export const firebaseConfig = {
        apiKey: "AIzaSyCoPfYFO45GDwQe3AHq_IRBPBPZVzUDrC4",
        authDomain: "chatskuola.firebaseapp.com",
        databaseURL: "https://chatskuola.firebaseio.com",
        projectId: "chatskuola",
        storageBucket: "chatskuola.appspot.com",
        messagingSenderId: "1062548123283"
    };
  
  export const facebookLoginEnabled = false;
  export const googleLoginEnabled = false;
  export const phoneLoginEnabled = false;

    export const facebookAppId: string = "211119446220074";
    export const googleClientId: string = "1062548123283-fa2ol5m8votpp15d6co12mj717qalpaa.apps.googleusercontent.com";
  export const customTokenUrl: string = "https://us-central1-chatapp-3f829.cloudfunctions.net/getCustomToken";
  
  export const homePage = HometabPage;
}