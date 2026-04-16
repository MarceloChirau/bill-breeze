import {processInvoice} from "../aiClient.js";
import {bucket} from "../config/firebaseAdmin.js"
import path from 'path';

// i will get the uid and storagePath from the controller:
export async function extractBillInfo(uid,storagePath){
    try{

        if(!storagePath.startsWith(`users/${uid}/`)) throw new Error('Problem with user');
        const file=bucket.file(storagePath);
        const [buffer]=await file.download();// buffer is binary
        const [metadata]=await file.getMetadata();
        // const ext=path.extname(storagePath).toLowerCase();
        const mimeType=metadata.contentType;
        const base64=buffer.toString("base64");// we turn binary into text, so we can use it in json
//here i will call the ai:
const jsonInfo= await processInvoice(base64,mimeType);
return jsonInfo;

    }catch(err){
        console.error('Error:',err.message)
        throw err;
    }


}
