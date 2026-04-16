import { initializeApp,cert,getApp,getApps } from "firebase-admin/app";
import {getStorage} from "firebase-admin/storage";
const app= getApps().length
? getApp()
: initializeApp({credential:cert('/Users/marcelchirau/bill-breeze/backend/.secret'),
    storageBucket: "bill-breeze-54906.firebasestorage.app"});

console.log('getApps().length:', getApps().length);

  export  const bucket = getStorage(app).bucket();



export default app;