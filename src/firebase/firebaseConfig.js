import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getAuth } from '@firebase/auth';   // for authentication

const firebaseConfig = {
    apiKey: "AIzaSyD-WdNtY_prSK3v-s9mevgMKYlUH2tpNe0",
    authDomain: "oriol-todolist.firebaseapp.com",
    projectId: "oriol-todolist",
    storageBucket: "oriol-todolist.appspot.com",
    messagingSenderId: "887631122239",
    appId: "1:887631122239:web:09c78101c2319a580b0d8a",
    measurementId: "G-3STP0FRCYG"
}

export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const firestore = getFirestore(firebase)
