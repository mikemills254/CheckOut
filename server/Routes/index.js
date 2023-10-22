import { Router } from "express";
import { createToken } from '../MiddleWare/middleware.js';
import axios from "axios";
import { Payment } from "../Utils/models.js";
import { DataBase } from "../Utils/DbConnect.js";

const router = Router();

function getTimestamp() {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');

    return year + month + date + hour + minute + second;
}

router.post('/stkTill', createToken, async (req, res) => {
    const phone = req.body.phone;
    const email = req.body.email;
    console.log(email)
    const shortCode = "174379";
    const amount = req.body.amount;
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const timeStamp = "20160216165627";
    const password = process.env.PASSWORD;
    const token = req.accessToken;

    const data = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timeStamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: "https://6a71-154-159-237-135.ngrok-free.app/callBack",
        AccountReference: "CashOut",
        TransactionDesc: "Test"
    }

    try {
        const results = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('results', results.data);
        res.status(200).json({ msg: results.data });
    } catch (err) {
        console.error(err);
        res.status(500).json(err.response.data);
    }
});

router.post('/callBack', async (req, res) => {
    console.log('callBack recieved')
    const callBack = req.body;
    console.log('where is it', callBack.Body)
    if (callBack.Body.stkCallback.CallbackMetadata) {
        const phone = callBack.Body.stkCallback.CallbackMetadata.Item[3].Value;
        const amount = callBack.Body.stkCallback.CallbackMetadata.Item[0].Value;
        const trans_id = callBack.Body.stkCallback.CallbackMetadata.Item[1].Value;

        console.log({ phone, amount, trans_id });
        console.log('Transaction went through', callBack.Body.stkCallback.CallbackMetadata);

        // Create a Payment object
        const payment = {
            number: phone,
            trnx_id: trans_id,
            amount: amount
        }
        try {
            await DataBase.InsertData('transactions', 'tillPayments', payment)
        } catch (error) {
            console.log(error)
        }
        res.status(400).json('ok')
    }else {
        console.log(callBack.Body.stkCallback);
        res.status(500).json('not Okay')
    }

});



export default router