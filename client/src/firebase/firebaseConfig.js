import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';  

const firebaseConfig = {
    apiKey: "AIzaSyC1774CVhgVUQqXe9fXS1-yPvbLO6gC28I",
    authDomain: "blog-website-806fd.firebaseapp.com",
    projectId: "blog-website-806fd",
    storageBucket: "blog-website-806fd.appspot.com",
    messagingSenderId: "493205175438",
    appId: "1:493205175438:web:e2dcbcff28d3428e4adddf"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);  

export { app, auth, db };