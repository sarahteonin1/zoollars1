import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDq08Ur6HiBDFYuseNnvZg7nLjm9XCtu7I",
  authDomain: "zoollars.firebaseapp.com",
  projectId: "zoollars",
  storageBucket: "zoollars.appspot.com",
  messagingSenderId: "972399774288",
  appId: "1:972399774288:ios:669dafaa875beb31479f55",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };