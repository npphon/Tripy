// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMo1wffhSt91aXrpGWToQcnQ3sYLfaKvA",
  authDomain: "split-pocket.firebaseapp.com",
  projectId: "split-pocket",
  storageBucket: "split-pocket.appspot.com",
  messagingSenderId: "104848244052",
  appId: "1:104848244052:web:7de00097cc1b9d4ec69cc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const pocketRef = collection(db, 'pockets')
export const expensesRef = collection (db, 'expenses')

export default app;