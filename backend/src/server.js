import dotenv from 'dotenv';
dotenv.config({path:'./.env'})
import app from './app.js'
import mongoose from 'mongoose';


const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log('server runs at port:',`${PORT}`)
})

mongoose.connect(process.env.MONGO_DB_LINK).then((result)=>{
    console.log('server connected to db!')

}).catch(err=>console.error('Error:',err))
