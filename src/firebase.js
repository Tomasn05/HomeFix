// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSbhqlMWy4yaInrfKMTljfMGT8_2iXJWs",
  authDomain: "homefix-b5d9c.firebaseapp.com",
  projectId: "homefix-b5d9c",
  storageBucket: "homefix-b5d9c.firebasestorage.app",
  messagingSenderId: "190511436838",
  appId: "1:190511436838:web:0ddc87f6bc69f9c29582e7",
  measurementId: "G-HB3FKJLMMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
