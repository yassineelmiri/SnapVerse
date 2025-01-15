import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; 
import { getStorage } from "firebase/storage";

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAvVl3U1VB0NXVfVxhplVGZuMF64yWKbxA",
    authDomain: "rnauthvideo-97c04.firebaseapp.com",
    projectId: "rnauthvideo-97c04",
    storageBucket: "rnauthvideo-97c04.appspot.com",
    messagingSenderId: "894209348477",
    appId: "1:894209348477:web:41d7598f7847c3e8593214",
    databaseURL: "https://rnauthvideo-97c04-default-rtdb.firebaseio.com/"
};


// Initialiser Firebase uniquement si aucune instance n'existe
let FIREBASE_APP;
if (!getApps().length) {
    FIREBASE_APP = initializeApp(firebaseConfig);
} else {
    FIREBASE_APP = getApps()[0];
}

// Export des services
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getDatabase(FIREBASE_APP); 
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
export const FIRESTORE = getFirestore(FIREBASE_APP); 
