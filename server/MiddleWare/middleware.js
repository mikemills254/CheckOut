import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

export const createToken = async (req, res, next) => {
    const secret = process.env.CUSTOMER_SECRET;
    const customer = process.env.CONSUMER_KEY;

    if (!secret || !customer) {
        return res.status(400).json({ error: "Missing customer secret or key" });
    }

    const auth = Buffer.from(`${customer}:${secret}`).toString("base64");

    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${auth}`,
            }
        });

        const token = response.data.access_token;
        req.accessToken = token;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve the access token", details: error.message });
    }
};
