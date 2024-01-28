// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXWbi8FfsmTs75vJhCNwuzurCKcDIHzPs",
  authDomain: "split-pocket-aea1c.firebaseapp.com",
  projectId: "split-pocket-aea1c",
  storageBucket: "split-pocket-aea1c.appspot.com",
  messagingSenderId: "139058903694",
  appId: "1:139058903694:web:cde1faa7e4e263b224e7df"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const pocketRef = collection(db, 'pockets')
export const cashboxRef = collection(db, 'cashbox')
export const expensesRef = collection (db, 'expenses')

export default app;