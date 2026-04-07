import { signInFunction, signOutFunction,auth } from "./firebaseConfig.js";
import {
      onAuthStateChanged

  } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const signInBtn=document.getElementById('signBtn');
const signOutBtn=document.getElementById('signOutBtn');


if (!signInBtn) {
  console.error("[ui] Could not find #signBtn in the DOM");
}
if (!signOutBtn) {
  console.error("[ui] Could not find #signOutBtn in the DOM");
}

signInBtn?.addEventListener('click', async () => {
    console.log("[ui] sign button clicked");
    try{

        const user= await signInFunction();
        console.log("[ui] signInFunction returned:", user);
        if (user) console.log('user signed in:', user.email)
        else console.log("[ui] sign-in returned null (see error logs above)");
    }catch(err){
        console.log("[ui] sign in failed", err?.code, err?.message, err);
    }
})


signOutBtn?.addEventListener('click',async()=>{
    try{

        const ok=await signOutFunction();
        if (ok===null){
            console.log('sign out failed');
        }else{
            console.log('log out succeded!')
        }
    }catch(error){
        console.error("error:",error);
    }
})



onAuthStateChanged(auth,(user)=>{
    if (!signInBtn || !signOutBtn) return;
    if(user){
        signInBtn.hidden=true;
        signOutBtn.hidden=false;
    }else{

        signInBtn.hidden=false;
        signOutBtn.hidden=true; 
    }
})
