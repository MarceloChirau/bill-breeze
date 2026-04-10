import express from 'express';
const me=express.Router();
import { requireAuth } from '../middleware/requireAuth.js';


me.route('/me').get(requireAuth,(req,res,next)=>{
    console.log('user is authorized!and this is the user from the routes:',req.user);

    res.status(200).json({
        
        user:req.user
    })
});

export default me;