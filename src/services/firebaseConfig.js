import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase 
const firebaseConfig = {
  apiKey: "AIzaSyDXPj27dhUAfNzQlSZ41W8V_7Xmc4rBgQM",
  authDomain: "app-react-native-a58ab.firebaseapp.com", 
  projectId: "app-react-native-a58ab",
  storageBucket: "app-react-native-a58ab.firebasestorage.app",
  messagingSenderId: "943303827172",
  appId: "1:943303827172:android:9eae09515f8386658b56f1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };