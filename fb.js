import firebase from "firebase"

const firebaseConfig = {
  apiKey: "AIzaSyDMsCU76Br1OrjYznuu9dveehhuhmVXyzw",
  authDomain: "notes-5dcaa.firebaseapp.com",
  projectId: "notes-5dcaa",
  storageBucket: "notes-5dcaa.appspot.com",
  messagingSenderId: "575875805642",
  appId: "1:575875805642:web:222f7cff187960ef871f33"
}

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()

export default firebase