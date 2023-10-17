import express from 'express';
import cors from 'cors';
import router from './Routes/index.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});
