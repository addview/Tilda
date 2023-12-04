import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBopr6LO-8qhIfm2oUeTxcgKo_B33LnNUg",
  authDomain: "singelvisa.firebaseapp.com",
  projectId: "singelvisa",
  storageBucket: "singelvisa.appspot.com",
  messagingSenderId: "947224097736",
  appId: "1:947224097736:web:728d0d28323a859319c6fd",
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
