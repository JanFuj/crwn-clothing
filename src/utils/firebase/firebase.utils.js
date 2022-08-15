import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDp-E9qhH76NbTO5IrrhHlO06iIE9-fvcM",
  authDomain: "crwn-clothing-db-4077d.firebaseapp.com",
  projectId: "crwn-clothing-db-4077d",
  storageBucket: "crwn-clothing-db-4077d.appspot.com",
  messagingSenderId: "525435764768",
  appId: "1:525435764768:web:459cc1968324925ed8bc45",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth) => {
  //storing user data to db
  const userDocRef = doc(db, "users", userAuth.uid);

  console.log(userDocRef);
  const userSnapshot = await getDoc(userDocRef);
  if (userSnapshot.exists()) return userDocRef;

  const { displayName, email } = userAuth;
  const createdAt = new Date();

  try {
    await setDoc(userDocRef, {
      displayName,
      email,
      createdAt,
    });
  } catch (error) {
    console.log("error creating the user", error.message);
  }
};
