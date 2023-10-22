import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_CLIENT_REFRESH;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, 'https://developers.google.com/oauthplayground');
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export const sendEmail = async (name, recieptNo, toWho, amount) => {
    const mailOptions = {
        from: 'studentpay6@gmail.com',
        to: toWho,
        subject: "Purchase Acknowledgment",
        text: `
        Dear ${name},

        We acknowledge your recent purchase from CheckOut. Thank you for choosing to shop with us. Your support is greatly appreciated.
        Below, you'll find important details regarding your purchase:
        - Receipt Number: ${recieptNo}
        - Expected Date of Delivery: 2 business days
        - Amount paid: ${amount}
        Please keep this information handy for reference. If you have any questions or need further assistance, please don't hesitate to reach out to us.
        Once again, thank you for your purchase. We look forward to serving you again in the future.

        Best regards,
        Check Out
        0701233944
        studentpay6@gmail.com
        `,
    };

    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'studentpay6@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        throw error;
    }
};
