import { initializeApp,cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
const app=initializeApp({credential:cert('/Users/marcelchirau/bill-breeze/backend/.secret')});


export async function requireAuth(req,res,next){
const header=req.headers.authorization || "";
const match=header.match(/^Bearer (.+)$/);
if(!match) return res.status(401).json({error:"Missing Bearer token"});
try{
    const decoded=await getAuth().verifyIdToken(match[1]);
    console.log('user is authorized!And this is decoded:',decoded);
    req.user=decoded;
    return next();
}catch(err){
    console.error('error:',err)
    return res.status(401).json({error:'Invalid token'})
}

}

/*
var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
*/






  /* How does the backend “get the uid”?
It doesn’t get it from the frontend as a trusted value.

The secure flow is:

Frontend sends ID token (JWT) in Authorization: Bearer ...
Backend runs getAuth().verifyIdToken(token)
Verification returns a decoded object that contains uid
Backend uses that uid in MongoDB queries
So: yes, the token originates from the frontend, but the uid you trust comes from the backend after verification.

Where getUser(uid) fits
getAuth().getUser(uid) is optional. You use it when you need extra info from Firebase (like emailVerified, disabled, custom claims). For most API endpoints, you don’t need it—verifyIdToken already gives you uid (and often email).

/////////////////////////////////////////

How the JWT is generated (conceptually)
User signs in with Firebase (Web SDK).
Firebase Auth contacts Firebase servers and establishes a session.
When you call getIdToken(), Firebase returns a signed JWT (ID token) for that user.
You send that string to your backend in the Authorization header.
Docs: getIdToken() (Web SDK): https://firebase.google.com/docs/reference/js/auth.user.md#getidtoken

What “sending it to the backend” looks like
Get token (from the current user)
Attach to fetch:

Authorization: Bearer <the_token_string>

 */