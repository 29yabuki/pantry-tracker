// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-Fvd8OOh4Ko5W7B7NSBRVtFMhV3DTnQ0",
  authDomain: "pantry-tracker-48777.firebaseapp.com",
  projectId: "pantry-tracker-48777",
  storageBucket: "pantry-tracker-48777.appspot.com",
  messagingSenderId: "909064963116",
  appId: "1:909064963116:web:9d3f7b30e3cdfac403fd89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth();
export {app, firestore, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut};