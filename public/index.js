import { signInFunction, signOutFunction,auth} from "./firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword

  } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
// import {getStorage,ref,uploadBytes} from "firebase";
import { getStorage, ref, uploadBytes} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";
import {renderExtractedBill} from './renderExtractedBill.js'
//https://www.gstatic.com/firebase/12.11.0/firebase-storage.js
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

const inputContainer=document.getElementById('inputContainer');
const input=document.getElementById('input');
const inputMsg=document.getElementById('inputMsg');
const label=document.querySelector('label');
const getBillBtn=document.getElementById('submitBtn');
const form=document.querySelector('form');

const previewContainer=document.querySelector('.preview');
const img=document.createElement('img');
const iFrame=document.createElement('iframe');
const cancelBtn=document.createElement('button');
const infoOutputContainer=document.querySelector('.infoOutputContainer');
const loading=document.getElementById("loading");
cancelBtn.classList.add('btn')
cancelBtn.textContent='Cancel';
let previewURL;

//managing the preview container :
previewContainer.style.width='400px';
previewContainer.style.height='400px';
previewContainer.style.border='3px  dashed dimgray';
img.style.width='100%';
img.style.height='100%';
iFrame.style.width="100%";
iFrame.style.height="100%";

//getBillBtn add not allowed untill there is an input.value change
getBillBtn.style.cursor='not-allowed'

//hide the ugly input button, and decorate the label instead
input.style.opacity=0;
label.classList.add('btn');

//cancelFunction:
function cancelPreview(){
    previewContainer.innerHTML="";
    input.value='';
    inputMsg.textContent='No file has been selected/uploaded yet';
    cancelBtn.style.display='none';
    submitBtn.style.disabled=true;
getBillBtn.style.cursor='not-allowed'


}

//if user hits the cancelo btn or esc while he is choosing a file:
input.addEventListener('cancel',()=>{
    console.log('User canceled his selection!')
    cancelPreview();
})

//and also we attach the cancelPreview function to the cancel btn:
cancelBtn.addEventListener('click',()=>{
    console.log('User canceled his selection!')

    cancelPreview();


})


//just to preview the file before to upload and also get info out of it with the help of ai :
input.addEventListener('change',()=>{
    const curFiles=input.files?.[0];
if (curFiles.length===0){
    inputMsg.textContent="No file has been selected/uploaded yet";
}

//making sure the file is one of these extensions:
const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
if(!validTypes.includes(curFiles.type)){
    alert("Please upload a valid Image or pdf.")
    input.value='';
}


if(curFiles.type==='application/pdf'){
    // remove the img and URL to avoid leaking memory
    if(iFrame.src) URL.revokeObjectURL(iFrame.src);
    if(img.src) URL.revokeObjectURL(img.src)
        
        previewURL=URL.createObjectURL(curFiles);
    iFrame.src=previewURL;
previewContainer.appendChild(iFrame);
inputMsg.textContent=`File has been selected:${curFiles.name} ${curFiles.type}, ${curFiles.size} bytes `;
    
     // activate the submit btn:
     getBillBtn.disabled=false;
     
     // since there is a proper file we will add a cancel btn, in case user changes mind:
     form.appendChild(cancelBtn);
     cancelBtn.style.display='block';

}else{
    // remove the img and URL to avoid leaking memory
    if(iFrame.src) URL.revokeObjectURL(iFrame.src);
    if(img.src) URL.revokeObjectURL(img.src)
    //storing the temporary local url and use as src in img:
     previewURL=URL.createObjectURL(curFiles);
     img.src=previewURL;
     previewContainer.appendChild(img);
     inputMsg.textContent=`File has been selected:${curFiles.name} ${curFiles.type}, ${curFiles.size} bytes `;
    
     // activate the submit btn:
     getBillBtn.disabled=false;
     
     // since there is a proper file we will add a cancel btn, in case user changes mind:
     form.appendChild(cancelBtn);
     cancelBtn.style.display='block';

}
getBillBtn.style.cursor='pointer'


})





form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    loading.hidden=false;
    if(!auth.currentUser)return;
    const file=input.files[0];
    const mimeType=file.type;

    if(!file){
        console.log('There is no file uploaded');
        return;
    }

const storage=getStorage();
const user=auth.currentUser;
const uid=user.uid;
const ts = new Date().toISOString().replace(/[:.]/g, "-");
const billRef=ref(storage,`users/${uid}/${ts}/${file.name}`);


const storagePath=billRef.fullPath;
console.log('fullpath:',storagePath);
try{

    await uploadBytes(billRef,file,{contentType:file.type});
    // console.log('storageRef:',snapshot.ref.fullPath)
const idToken=await auth.currentUser.getIdToken();

const res=await fetch("/v1/api/ai/extract-bill",{
    method:"POST",
    headers:{Authorization:`Bearer ${idToken}`,
"Content-Type":"application/json"},
body:JSON.stringify({storagePath})
})
const data=await res.json(); 
loading.hidden=true;
if(!res.ok){
    console.error("AI endpoint failed:", data);
    infoOutputContainer.textContent = data?.msg ?? "Extraction failed.";
    return;
}
const aiText=data.data;
console.log('this aitext in frontend:',aiText);
console.log('this aitext.category in frontend:',aiText.category);

// console.log('type of aiText:',typeof aiText);
// const jsonMatch = aiText.match(/```json\s?([\s\S]*?)\s?```/) || aiText.match(/```([\s\S]*?)\s?```/);
// const cleanData = jsonMatch ? jsonMatch[1].trim() : aiText.trim();

// const obj=JSON.parse(cleanData);
//here will use renderExtractedBill 
renderExtractedBill(infoOutputContainer,aiText);
//let's see the actuall response:
// console.log("data:",data);
    // remove the img and URL to avoid leaking memory
    URL.revokeObjectURL(previewURL);
        if(previewContainer.querySelector('img')) previewContainer.removeChild(img)
        if(previewContainer.querySelector('iframe')) previewContainer.removeChild(iFrame);
        if(form.contains(cancelBtn)) cancelBtn.style.display='none';
    
    //update the input msg:
    inputMsg.textContent="File has been submited/saved"
    setTimeout(()=>{
    inputMsg.textContent="Ready for another submit!";

    },3000)
    console.log('the form is submited!') 

}catch(err){
console.error("error:",err)
}

})







signInBtn?.addEventListener('click', async () => {
    try{

        const user= await signInFunction();
        console.log("signInFunction with google signin returned user:", user);
        if (user){
            console.log('user signed in:', user.email)
            const idToken=await user.getIdToken();
            await fetch("/v1/api/me",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${idToken}`,
                }
            })
            // createUserContainer.hidden=true;
            // createUserContainer.style.display=none;


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
// createUserContainer.hidden=false;


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
        inputContainer.hidden=false;
        // createUserContainer.hidden=true;
        createUserContainer.style.display="none";


    }else{

        signInBtn.hidden=false;
        signOutBtn.hidden=true; 
        inputContainer.hidden=true;
        createUserContainer.hidden=false;

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
        console.log('user signed in:', user.email)

        const idToken=await user.getIdToken();
        await fetch("/v1/api/me",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${idToken}`,
            }
        })

        //making empty the inputs and hide the container:
        emailInput.value="";
        passwordInput.value=""
        emailInput.hidden=true;
        passwordInput.hidden=true;
// createUserContainer.hidden=true;
// inputContainer.hidden=false;


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

        const idToken=await user.getIdToken();
        await fetch("/v1/api/me",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${idToken}`,
            }
        })



//hiding everything except the signOut and making the inputs empty:
alreadyEmailInput.value="";
alreadyPasswordInput.value="";
alreadyPasswordInput.hidden=true;
alreadyEmailInput.hidden=true;
// createUserContainer.hidden=true;


        return user;
    }catch(err){
        console.error('there is no user with these credentials:',err.message);

    }
})


//create storage:



// const fullpath=electricityRef.fullpath;
// const name=electricityRef.name;
// const imageRef=electricityRef.parent;













//email: marcelochirau@gmail.com
// password: 123swd3
// uid: RQJ7kdSTmMW0AIFTcs2UMNPoMq63

