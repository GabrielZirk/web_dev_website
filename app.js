const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
require('dotenv').config();

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
    console.log(req.body.fullName, req.body.mailAdress, req.body.message);
    mailBody = "Mail: " + req.body.mailAdress + "\n" + "Name: " + req.body.fullName + "\n" + "Message: " + req.body.message

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
    });
    








    res.redirect("/#contact")
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server started successfully.");
});