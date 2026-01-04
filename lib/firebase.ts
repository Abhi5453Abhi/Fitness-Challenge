import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace with your actual Firebase project configuration
// Get these from Firebase Console -> Project Settings
const firebaseConfig = {
    apiKey: "AIzaSyDv31ZNjgSOeRSLRS-nydI678foWrnZY8Q",
    authDomain: "ai-fitness-pal-8b8e5.firebaseapp.com",
    projectId: "ai-fitness-pal-8b8e5",
    storageBucket: "ai-fitness-pal-8b8e5.firebasestorage.app",
    messagingSenderId: "863372813976",
    appId: "1:863372813976:web:5b9081c1622cd8a4bf12ed",
    measurementId: "G-1R0H16RHRR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
