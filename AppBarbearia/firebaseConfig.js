// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCQTDPM2wS0dPK48yRZ20VBAN448EgSS4A",
  authDomain: "appbarbearia-20fc0.firebaseapp.com",
  projectId: "appbarbearia-20fc0",
  storageBucket: "appbarbearia-20fc0.firebasestorage.app",
  messagingSenderId: "540134471030",
  appId: "1:540134471030:web:aacdc6233fe118a7cc3657"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);