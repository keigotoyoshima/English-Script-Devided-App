// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnZv8iuxQLTzDA2F4N5a1C03qwIHrLRYU",
  authDomain: "for-english-learning.firebaseapp.com",
  projectId: "for-english-learning",
  storageBucket: "for-english-learning.appspot.com",
  messagingSenderId: "116097721015",
  appId: "1:116097721015:web:eae3fcd0ea92c27d0fe332"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);