import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase project configuration
// Get these from Firebase Console -> Project Settings
const firebaseConfig = {
    apiKey: "AIzaSyCCiaJV9ae4kiEbbr-HEDMx9ZwHSve5gQE",
    authDomain: "fitness-challenge-859bb.firebaseapp.com",
    projectId: "fitness-challenge-859bb",
    storageBucket: "fitness-challenge-859bb.firebasestorage.app",
    messagingSenderId: "824872061696",
    appId: "1:824872061696:web:9e31a172a82c4684a1c1e5",
    measurementId: "G-D778H6P5HH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
