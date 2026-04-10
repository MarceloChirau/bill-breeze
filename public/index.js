import { signInFunction, signOutFunction,auth} from "./firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword

  } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const signInBtn=document.getElementById('signBtn');
const signOutBtn=document.getElementById('signOutBtn');

const signUpBtn=document.getElementById('signUp');
const submitBtn=document.getElementById('createUserBtn');
const emailInput=document.getElementById('email');
const passwordInput=document.getElementById('password');

const logAlreadyUserBtn=document.getElementById('logAlreadyUser');
const alreadyEmailInput=document.getElementById('alreadyEmail');
const alreadyPasswordInput=document.getElementById('alreadyPassword');
const logUserBtn=document.getElementById('logUserBtn');
const createUserContainer=document.querySelector('.createUserContainer');




if (!signInBtn) {
  console.error("[ui] Could not find #signBtn in the DOM");
}
if (!signOutBtn) {
  console.error("[ui] Could not find #signOutBtn in the DOM");
}

signInBtn?.addEventListener('click', async () => {
    try{

        const user= await signInFunction();
        console.log("signInFunction with google signin returned user:", user);
        if (user){
            console.log('user signed in:', user.email)
            const idToken=await user.getIdToken();
            await fetch("http://localhost:3000/v1/api/me",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${idToken}`,
                }
            })

        } 
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
            console.log('this is what ok has inside:',ok)
            console.log('log out succeded!')
            console.log('showing the container with other options:')
createUserContainer.hidden=false;

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


signUpBtn?.addEventListener('click',()=>{
    emailInput.hidden=false;
    passwordInput.hidden=false;
    submitBtn.hidden=false;
})

submitBtn?.addEventListener('click',async()=>{
    try{
        console.log('email:',emailInput.value);
        console.log('password:',passwordInput.value);

        const result=await createUserWithEmailAndPassword(auth,emailInput.value,passwordInput.value);
        const user=result.user;
        console.log('user is creared:',user)
        console.log('user id:',user?.uid)
        //making empty the inputs and hide the container:
        emailInput.value="";
        passwordInput.value=""
        emailInput.hidden=true;
        passwordInput.hidden=true;
createUserContainer.hidden=true;

        return user;
    }catch(error){
        console.error('Couldnt create a user:',error)
        console.log('msg:',error.message)
    }
})


logAlreadyUserBtn?.addEventListener('click',()=>{
    alreadyEmailInput.hidden=false;
alreadyPasswordInput.hidden=false;
logUserBtn.hidden=false;
})



logUserBtn?.addEventListener('click',async()=>{
    try{

        console.log('already a user, email:',alreadyEmailInput.value);
        console.log('already a user, password:',alreadyPasswordInput.value);
        const result=await signInWithEmailAndPassword(auth,alreadyEmailInput.value,alreadyPasswordInput.value);
    
        const user=result.user;
        console.log('already an existant user:',user);
        console.log('this user exists and his id is :',user.uid)
//hiding everything except the signOut and making the inputs empty:
alreadyEmailInput.value="";
alreadyPasswordInput.value="";
alreadyPasswordInput.hidden=true;
alreadyEmailInput.hidden=true;
createUserContainer.hidden=true;

        return user;
    }catch(err){
        console.error('there is no user with these credentials:',err.message);

    }
})

//email: marcelochirau@gmail.com
// password: 123swd3
// uid: RQJ7kdSTmMW0AIFTcs2UMNPoMq63