require("dotenv").config()
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser')
const nodemailer = require("nodemailer");
// 
const app = express();
const port = process.env.BASE_PORT;
const url = process.env.BASE_URL;

const corsOption = {
	origin : '*',
	optionSuccessStatus:200
}
app.use(cors(corsOption))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan(':response-time :method :url '))

// temp
let email;
let password

// nodemailer
let transporter = () => nodemailer.createTransport({
	host: "smtp.zoho.com",
	secure: true,
	port: 465,
	auth: {
		user: email,
		pass: password,
	},
});

async function sendMail(mailOption){
	try{
		console.log(email,password)
		const data = await transporter().sendMail(mailOption)
		console.debug("email sent : ",data.response ?? data)
		return data.response ?? data
	} catch(err){
		console.debug("email error : ", err.message ?? err)
		return false
	}
}

const sendEmailData = async (destination, subject, text) => {
	console.log("sendEmailData : ",email,password,destination,subject,text)
	const mailOption = {
		from: email,
		to: destination,
		subject,
		text
	}
	return await sendMail(mailOption)
}

app.post("/", async  (req, res) => {
	let {destination,subject,text} = req.body
	email = req.body.email
	password = req.body.password
	console.log(email,password,destination,subject,text)
	if(!email || !password || !destination || !subject || !text){
		return res.status(404).json({status:404,message:"email, password, destination, subject and text required"});
	}
	
	let sendOTP = await sendEmailData(destination,subject,text)
	if(!sendOTP){
		email=""
		password=""
		return res.status(404).json({status:404,message:"send email error"});
	}
	
	
	return res.status(200).json({status:200,message:"success send email",text:sendOTP});
});

app.get("/", (req, res) => {
    res.send("Hello Mail Sender!");
});

app.listen(port, () => {
    console.log(`The app listening on port ${port}, open in ${url}:${port}`);
});
