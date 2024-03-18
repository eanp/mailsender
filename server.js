"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const app = (0, express_1.default)();
const port = parseInt(process.env.BASE_PORT || "3000");
const url = process.env.BASE_URL || "http://localhost";
const corsOption = {
    origin: '*',
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOption));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)(':response-time :method :url '));
let email;
let password;
const transporter = () => nodemailer_1.default.createTransport({
    host: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
        user: email,
        pass: password,
    },
});
function sendMail(mailOption) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            console.log(email, password);
            const data = yield transporter().sendMail(mailOption);
            console.debug("email sent : ", (_a = data.response) !== null && _a !== void 0 ? _a : data);
            return (_b = data.response) !== null && _b !== void 0 ? _b : data;
        }
        catch (err) {
            console.debug("email error : ", (_c = err.message) !== null && _c !== void 0 ? _c : err);
            return false;
        }
    });
}
const sendEmailData = (destination, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("sendEmailData : ", email, password, destination, subject, text);
    const mailOption = {
        from: email,
        to: destination,
        subject,
        text
    };
    return yield sendMail(mailOption);
});
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { destination, subject, text } = req.body;
    email = req.body.email;
    password = req.body.password;
    console.log(email, password, destination, subject, text);
    if (!email || !password || !destination || !subject || !text) {
        return res.status(404).json({ status: 404, message: "email, password, destination, subject and text required" });
    }
    let sendOTP = yield sendEmailData(destination, subject, text);
    if (!sendOTP) {
        email = "";
        password = "";
        return res.status(404).json({ status: 404, message: "send email error" });
    }
    return res.status(200).json({ status: 200, message: "success send email", text: sendOTP });
}));
app.get("/", (req, res) => {
    res.send("Hello Mail Sender!");
});
app.listen(port, () => {
    console.log(`The app listening on port ${port}, open in ${url}:${port}`);
});
