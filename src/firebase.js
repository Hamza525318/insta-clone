import firebase from "firebase";

const firebaseApp = firebase.initializeApp({

    apiKey: "AIzaSyCTk9tEilaCf1TwEfHvj37-MdW1q2vZ8Nc",
    authDomain: "instagram-clone-80080.firebaseapp.com",
    projectId: "instagram-clone-80080",
    storageBucket: "instagram-clone-80080.appspot.com",
    messagingSenderId: "1001881767205",
    appId: "1:1001881767205:web:dcfd2207558e40c84b5ecc",
    measurementId: "G-DV512B8KYH"

});

const dbs = firebaseApp.firestore();   //for the database
const auth = firebase.auth();    // for logging in logging out adding users ets
const storage = firebase.storage();   //for adding images captions posts etc

export  {dbs,auth,storage};