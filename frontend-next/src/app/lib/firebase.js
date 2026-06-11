import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxGDiJX4mkiylWBEivJ6jrAmLrCuEKyps",
  authDomain: "dublin-bus-weather-case-study.firebaseapp.com",
  projectId: "dublin-bus-weather-case-study",
  storageBucket: "dublin-bus-weather-case-study.firebasestorage.app",
  messagingSenderId: "822794161253",
  appId: "1:822794161253:web:b094f142ade84805120a8c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);