import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

let token;

export const createToken = async (req, res, next) => {
    const secret = process.env.CUSTOMER_SECRET;
    const customer = process.env.CONSUMER_KEY;

    if (!secret || !customer) {
        return res.status(400).json("Missing customer secret or key");
    }

    const auth = Buffer.from(`${customer}:${secret}`).toString("base64");

    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${auth}`,
            }
        });

        token = response.data.access_token;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: error.message});
    }
};

function getTimestamp() {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const date = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');

    return year + month + date + hour + minute + second;
}


export const tillStk = async (req, res) => {
    const phone = req.body.phone
    const shortCode = "174379"
    const amount = req.body.amount
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const timeStamp = getTimestamp()
    const password = process.env.PASSWORD

    const data = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: "20160216165627",
        TransactionType:"CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: "https://mydomain.com/pat",    
        AccountReference: "CashApp",    
        TransactionDesc:"Test"
    }

    try {
        const results = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
            console.log('results',results.data);
            res.status(200).json({msg: results.data});
        } catch (err) {
            console.error(err);
            res.status(500).json(err.response.data);
        }
    
};
