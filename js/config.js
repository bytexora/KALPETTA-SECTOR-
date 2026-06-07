// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyDUHFLCkUsbUzDLfRZFEgYi_YElfM9QTtk",
    authDomain: "sahityotsav-161fb.firebaseapp.com",
    databaseURL: "https://sahityotsav-161fb-default-rtdb.firebaseio.com",
    projectId: "sahityotsav-161fb",
    storageBucket: "sahityotsav-161fb.firebasestorage.app",
    messagingSenderId: "517664625868",
    appId: "1:517664625868:web:06d83b534ae260e91a5e69",
    measurementId: "G-TR645N4QNR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Database & Auth
const db = firebase.database();
const auth = firebase.auth();

// ImgBB API Key (ഇത് മാറില്ല)
const IMGBB_API_KEY = "Bc2b8211dfefec93b8908c0e4d7b266d";
