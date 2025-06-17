import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANIzgKnyTx9syQXtH5bivVUh-LWfMcpOI",
  authDomain: "central-dashboards.firebaseapp.com",
  projectId: "central-dashboards",
  storageBucket: "central-dashboards.firebasestorage.app",
  messagingSenderId: "203323283811",
  appId: "1:203323283811:web:4ef6135bb807a4541a9b56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app; 