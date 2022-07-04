const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
require('dotenv').config();
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAILMAIL,
        pass: process.env.GMAILPASS
    },
    tls: {
        rejectUnauthorized: false
    }
});




app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

app.post("/contact", (req, res) => {

    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
    {
      console.log("Something went wrong.");
    }

    const secretKey = process.env.RECAPTCHAKEY

    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL,function(error,response,body) {
        body = JSON.parse(body);
    
        if(body.success !== undefined && !body.success) {
         console.log("Failed captcha verification");
        }
        else {

    console.log(req.body)
    mailBody = "Mail: " + req.body.whoIsSending + "\n" + "Name: " + req.body.whoIsXyz + "\n" + "Message: " + req.body.whatsTheMatter

    let mailOptions = {
        from: req.body.mailAdress,
        to: "gabriel.zirkovits@gmail.com",
        subject: "Portfolio Website Contact Form",
        text: mailBody
    };
    
    transporter.sendMail(mailOptions, (err, success) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Mail successfully sent.")
            res.redirect("/#contact");
        }
    }
)}});
    

    res.redirect("/#contact")
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server started successfully.");
});