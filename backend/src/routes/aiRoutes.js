import express from 'express';
const ai=express.Router();
import { requireAuth } from '../middleware/requireAuth.js';
import {extractInfoController,showAllBillsController} from '../controllers/aiController.js'

ai.route('/extract-bill')
.post(requireAuth,extractInfoController)
.get(requireAuth,showAllBillsController);




export default ai;

/*me.route('/me').get(requireAuth,(req,res,next)=>{
    console.log('user is authorized!and this is the user from the routes:',req.user);

    res.status(200).json({
        
        user:req.user
    })
});
///v1/api/ai/extract-bill

export default me; */






