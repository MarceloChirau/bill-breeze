import express from 'express';
const app=express();
import cors from 'cors';
import me from './routes/meRoutes.js'
import ai from './routes/aiRoutes.js'
import path from "path";
import { fileURLToPath } from 'url';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);


app.use(express.static(path.join(__dirname,"../../public")))
app.use(express.json());
app.use(cors());

app.use('/v1/api/',me);
app.use('/v1/api/ai',ai);

///v1/api/ai/extract-bill










export default app;