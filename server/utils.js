const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' })
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const mongoose = require('mongoose');
const fs = require('fs')
const jwt = require('jsonwebtoken');

const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis:10000,
    ssl: true
})

function generate(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

 
function generateNoNumbers(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function sendEmail(key,email) {
    var readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: "utf-8" }, function (
          err,
          html
        ) {
          if (err) {
            throw err;
            callback(err);
          } else {
            callback(null, html);
          }
        });
    };

    readHTMLFile(__dirname + "/email.html", function (
        err,
        html
    ) {

        var template = handlebars.compile(html);
        var replacements = {
            key: key,
            name:process.env.APP_NAME,
            url:process.env.domain
        };
        var htmlToSend = template(replacements);
    
        var transporter = nodemailer.createTransport({
        host: "mail.privateemail.com",
        port: 587,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD,
        },
        });
    
        var mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: process.env.APP_NAME,
        text: "License Receipt",
        html: htmlToSend,
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
        });

    });


    
}

async function signAccess2(email,pm) {
    return new Promise((resolve) => {
        resolve(jwt.sign({email:email, pm:pm},process.env.JWT_SECRET,{
            expiresIn:"15s" //10s when using refresh 
        }))
    })
}

async function signAccess(user,flags) {
    return new Promise((resolve) => {
        resolve(jwt.sign({user:user, flags:flags},process.env.JWT_SECRET,{
            expiresIn:"30d" //10s when using refresh 
        }))
    })
}

async function signRefresh(user,flags) {
    return new Promise((resolve) => {
        resolve(jwt.sign({user:user, flags:flags},process.env.JWT_REFRESH_SECRET,{
            expiresIn:"30d" //10s when using refresh 
        }))
    })
}

async function verifyRefresh(refershToken) {
    return new Promise((resolve) => {
        jwt.verify(refershToken, process.env.JWT_REFRESH_SECRET, async (err ,decoded) => {
            if(err) resolve(null)
            else {
                resolve(decoded)
            }
        })
    })
}


// pool.connect()
module.exports = {
    pool:pool,
    generate:generate,
    generateNoNumbers:generateNoNumbers,
    sendEmail:sendEmail,
    signAccess:signAccess,
    signRefresh:signRefresh,
    verifyRefresh:verifyRefresh,
    signAccess2:signAccess2,
    // checkIfStaff:checkIfStaff
}
