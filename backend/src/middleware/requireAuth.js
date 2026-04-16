// import { initializeApp,cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import app from "../config/firebaseAdmin.js"

export async function requireAuth(req,res,next){
const header=req.headers.authorization || "";
const match=header.match(/^Bearer (.+)$/);
if(!match) return res.status(401).json({error:"Missing Bearer token"});
try{
    const decoded=await getAuth(app).verifyIdToken(match[1]);
    console.log('user is authorized!And this is decoded:',decoded);
    req.user=decoded;
    return next();
}catch(err){
    console.error('error:',err)
    return res.status(401).json({error:'Invalid token'})
}

}




