// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCjBQcKchO-YkxSKzB2UeB0KgfCW4vTfWM",
  authDomain: "quickhealth-a56ba.firebaseapp.com",
  projectId: "quickhealth-a56ba",
  storageBucket: "quickhealth-a56ba.appspot.com",
  messagingSenderId: "596189793125",
  appId: "1:596189793125:web:3e1094a9d94247a4002f8c",
  measurementId: "G-2CJBHVG92H",
};

const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

export default app;
