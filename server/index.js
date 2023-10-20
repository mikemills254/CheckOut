import express from 'express';
import cors from 'cors';
import router from './Routes/index.js';
import dotenv from 'dotenv';
import { DataBase } from './Utils/DbConnect.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.use(express.json());
app.use('/', router);

(async () => {
    try {
        const client = await DataBase.Connect()
        if(client){
            console.log("Database connected successfully")
            app.listen(PORT, ()=>{
                console.log(`Server is running on port ${PORT}`)
            })
        }
    } catch (error) {
        console.log('Error connecting to database'+ error.message)
    }
})()

