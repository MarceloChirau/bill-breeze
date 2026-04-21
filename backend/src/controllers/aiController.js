import {extractBillInfo} from '../services/billExtractionService.js'
import {saveOrUpdateBill,showAllBills} from '../services/billServices.js'

export const extractInfoController=async (req,res,next)=>{
    try{
const uid=req.user?.uid;
const {storagePath}=req.body;
if(!uid)return res.status(401).json({status:'fail',msg:"user is not allowed or doesnt exist"})
if (!storagePath)return res.status(400).json({status:'fail',msg:"there is no storagePath, attached from index.js "})
const info=await extractBillInfo(uid,storagePath);
if(!info)throw new Error('something went wrong with the extractBillInfo function, which is related with ai');
const bill=await saveOrUpdateBill(info);
if(bill)console.log('a new invoice is saved');
return res.status(200).json({status:'success',data:info
    
});
    }
    catch(err){
        if (err.status===429 || err.message.includes("429") || err.statusCode===429){
            console.error("Billbreeze is a bit busy.Please wait a m inute before uploading another bill:",err.message)
            
       return     res.status(429).json({status:'fail',msg:err.message});

          }else{

              console.error("Error inside the controller:",err.message)
           return   res.status(500).json({status:'fail',msg:err.message});
          }
        
    }
}

export const showAllBillsController=async(req,res,next)=>{
    try{

        const bills=await showAllBills();
        if(bills){
            res.status(200).json({status:'success',data:bills})
        }
    }catch(error){
        console.error('error from  showAllBillsController:',error.message);
        return;
    }
}