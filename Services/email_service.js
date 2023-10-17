const nodemailer = require("nodemailer");

// Create a transporter using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "improgrammer04@gmail.com",
        pass: "hdppqvqxzburdeyr"
    }
});

module.exports = transporter;
