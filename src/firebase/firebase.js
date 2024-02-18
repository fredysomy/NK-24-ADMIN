// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsSfJbJUxNflxSvGXS1Uzkv7ZU5jv0P8M",
  authDomain: "nakshatra-9c45c.firebaseapp.com",
  projectId: "nakshatra-9c45c",
  storageBucket: "nakshatra-9c45c.appspot.com",
  messagingSenderId: "203297675242",
  appId: "1:203297675242:web:e6b7a186ce19d20c324493",
  measurementId: "G-YM801F3ESG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();


export { db };