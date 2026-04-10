import express from 'express';
const app=express();
import cors from 'cors';
import me from './routes/meRoutes.js'

app.use(express.json());
app.use(cors());

app.use('/v1/api/',me);












export default app;