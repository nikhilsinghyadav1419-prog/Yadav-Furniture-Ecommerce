// ================================
// Firebase Configuration
// Yadav Furniture
// ================================


import { initializeApp } 

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";



import { getFirestore }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



import { getAuth }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";







// ================================
// Firebase Config
// ================================


const firebaseConfig = {


apiKey:
"AIzaSyDJFKMWc-J79rc2UbZDt7dzMVqB6enCQqE",



authDomain:
"yadav-furniture.firebaseapp.com",



projectId:
"yadav-furniture",



storageBucket:
"yadav-furniture.firebasestorage.app",



messagingSenderId:
"925544072206",



appId:
"1:925544072206:web:b44d2d1109953137a8285f",



measurementId:
"G-2Z3V4VZKE4"


};









// ================================
// Initialize Firebase
// ================================


const app =

initializeApp(firebaseConfig);






// Firestore Database

const db =

getFirestore(app);






// Firebase Authentication

const auth =

getAuth(app);







// Export

export {

db,

auth

};