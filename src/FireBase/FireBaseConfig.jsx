// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCm_-6qNML3W1avAn57CyUpy5o56NwGIP0",
  authDomain: "laxmopump5.firebaseapp.com",
  projectId: "laxmopump5",
  storageBucket: "laxmopump5.appspot.com",
  messagingSenderId: "494283509960",
  appId: "1:494283509960:web:f6f583ac074562b238d5fd",
  measurementId: "G-VBEN9186KQ"
};

// Initialize Firebase
// Initialize Firebase



const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app);

export { fireDB, auth }