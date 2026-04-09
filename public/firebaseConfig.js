// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoCrE5FhkfP3QFeOZGFifGSzpocUsdnVI",
  authDomain: "bill-breeze-54906.firebaseapp.com",
  projectId: "bill-breeze-54906",
  storageBucket: "bill-breeze-54906.firebasestorage.app",
  messagingSenderId: "631972696231",
  appId: "1:631972696231:web:f416680cb09745a5bc0b82",
  measurementId: "G-WR3M64NPG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



 export const auth=getAuth();
const provider = new GoogleAuthProvider();

export async function signInFunction(){
try{
const result=await signInWithPopup(auth,provider);
const credential = GoogleAuthProvider.credentialFromResult(result);
const token = credential?.accessToken;
const user = result.user;
return user;
}catch(error){
  console.error('error:',error)
  const errorCode = error.code;
  const errorMessage = error.message;
  // The email of the user's account used.
  const email = error.customData?.email;
  // The AuthCredential type that was used.
  const credential = GoogleAuthProvider.credentialFromError(error);
  // ...
  console.log("error Code:",errorCode);
  console.log('error message:',errorMessage);
  console.log('email:',email);
  console.log('credentials:',credential);
  return null; 

}
}

export async function signOutFunction(){
  try{
const result=await signOut(auth);
return result;
  }catch(error){
    console.error('error:',error)
  const errorCode = error.code;
  const errorMessage = error.message;
  console.log("error Code:",errorCode);
  console.log('error message:',errorMessage);
  return null; 

  }
}


