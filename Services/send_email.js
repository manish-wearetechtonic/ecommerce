const transporter = require("./email_service"); // Import the transporter you created

const sendEmail = async (emailContent) => {
    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail(emailContent);

        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;
