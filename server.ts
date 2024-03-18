import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from 'body-parser';
import nodemailer, { Transporter, SentMessageInfo,SendMailOptions } from "nodemailer";

const app = express();
const port: number = parseInt(process.env.BASE_PORT || "3000");
const url: string = process.env.BASE_URL || "http://localhost";

const corsOption: cors.CorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan(':response-time :method :url '));

let email: string;
let password: string;

const transporter = (): Transporter => nodemailer.createTransport({
    host: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
        user: email,
        pass: password,
    },
});

async function sendMail(mailOption: SendMailOptions): Promise<SentMessageInfo> {
    try {
        const data = await transporter().sendMail(mailOption);
        return data.response ?? data;
    } catch (err) {
        return false;
    }
}

const sendEmailData = async (destination: string, subject: string, text: string): Promise<SentMessageInfo> => {
    const mailOption = {
        from: email,
        to: destination,
        subject,
        text
    };
    return await sendMail(mailOption);
};

app.post("/", async (req: Request, res: Response) => {
    let { destination, subject, text } = req.body;
    email = req.body.email;
    password = req.body.password;
    console.debug(email, password, destination, subject, text);
    if (!email || !password || !destination || !subject || !text) {
        return res.status(404).json({ status: 404, message: "email, password, destination, subject and text required" });
    }

    let sendOTP = await sendEmailData(destination, subject, text);
    if (!sendOTP) {
        email = "";
        password = "";
        return res.status(404).json({ status: 404, message: "send email error" });
    }


    return res.status(200).json({ status: 200, message: "success send email", text: sendOTP });
});

app.get("/", (req: Request, res: Response) => {
    res.send("Hello Mail Sender!");
});

app.listen(port, () => {
    console.log(`The app listening on port ${port}, open in ${url}:${port}`);
});
