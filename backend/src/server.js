import dotenv from 'dotenv';
dotenv.config({path:'./.env'})
import app from './app.js'
import mongoose from 'mongoose';


const PORT=process.env.PORT || 3000;

if (!process.env.CORRECT_MONGO_DB_LINK) {
    console.error('MONGO_DB_LINK is missing from .env — cannot connect to MongoDB');
    process.exit(1);
}

mongoose.connect(process.env.CORRECT_MONGO_DB_LINK)
    .then(() => {
        console.log('server connected to db!');
        app.listen(PORT, () => {
            console.log('server runs at port:', `${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });
