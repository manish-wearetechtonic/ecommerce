const User = require("../Models/users.model");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const {signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken  } = require("../Auth/auth");

const sendEmail = require("../Services/send_email");


const generateOtpEmail = (name, otp) => {
    const emailTemplatePath = path.join(__dirname, "../mailer.html");
    const template = fs.readFileSync(emailTemplatePath, "utf-8");
    
    const formattedTemplate = template
        .replace("[User's Name]", name)
        .replace("[OTP]", otp);
    
    return formattedTemplate;
};
const addUser = async (req, res) => {
    try {
        let { email, name, password, phone } = req.body;

      
        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // Generate OTP
        const generatedOTP = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

       
        // Hash the password
        const hashPassword = await bcrypt.hash(password, 12);

        // Create the user document with OTP
        const createUser = await User.create({
            name,
            email,
            password: hashPassword,
            phone,
            // image: req.file.path,
            otp: generatedOTP, // Save the generated OTP
        });

        // Prepare the email content
        const emailContent = {
            to: email,
            subject: "OTP for Email Verification",
            html: generateOtpEmail(name, generatedOTP), // Use the generated OTP and user's name
        };

        // Send the OTP email
        await sendEmail(emailContent);

        return res.json({
            message: "User created successfully. An OTP has been sent to your email.",
            _id: createUser._id, // Note the change from `create._id` to `createUser._id`
        });
    } catch (error) {
        return res.json({
            message: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(409).json({ message: "User not exist" });
        }

        // Check if user's email is verified
        if (!user.isEmailVerified) {
            return res.status(401).json({ message: "Email not verified. Please verify your email first." });
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const accessToken = await signAccessToken(user);
        const refreshToken = await signRefreshToken(user);

        const doesExist = await User.findOne({ email });

        if (doesExist) {
            await User.updateOne(
                { email },
                {
                    $set: {
                        "tokens.$.refreshToken": refreshToken.token,
                    },
                }
            );
        } else {
            await User.updateOne(
                { email },
                {
                    $addToSet: {
                        "tokens.$.refreshToken": refreshToken.token,
                    },
                }
            );
        }

        const data = await User.findOne({ email }).select("name email _id");

        return res.json({
            message: "User signin successfully",
            data: {
                accessToken,
                accessExpiry: 24,
                refreshToken,
                refreshExpiry: 720,
                data,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        console.log(`User is ${user}`)
        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP."
            });
        }

        // Mark email as verified
        user.isEmailVerified = true;
        await user.save();

        return res.json({
            message: "Email verified successfully."
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const resetPassword = async(req, res) => {
    try {
        
        let { oldPassword, newPassword,confirmPassword} = req.body;

        if(!req.body){
            return res.status(402).json({
                status: 402,
                message: "oldPassword,newPassword and confirmPassword is required"
            })
        }
        if(newPassword.trim().length === 0 || confirmPassword.trim().length === 0){
            return res.status(402).json({
                status:402,
                message: "New password and Confirm password can not be empty"
            })
        }
        const user = await User.findOne({ _id: res.locals.id });

        if(!user){
            return res.status(404).json({
                status:404,
                message: "User not found"
            })
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        if(!passwordMatch){
            return res.status(402).json({
                status:402,
                message: "Password not matched"
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(402).json({
                status: 402,
                message: "New password and confirm password doesn't match"
            })
        }

        const hashPassword = await bcrypt.hash(confirmPassword, 12);

        user.password = hashPassword;
        await user.save()

        return res.status(200).json({
            status: 200,
            message: "Password changed successfully"
        })

    } catch (error) {
        if (error.name === 'ValidationError') {
          return res.status(400).json({
            status: 400,
            message: error.message,
          });
        } else if (error.name === 'MongoError') {
          return res.status(500).json({
            status: 500,
            message: "MongoDB Error: " + error.message,
          });
        } else {
          console.error("Unexpected Error:", error);
          return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
          });
        }
      }
}

const refreshToken = async (req, res) =>{
    try {
        const { accessToken, refreshToken } = req.body;
        console.log("kkibkjbkj");
        const payload = await verifyAccessToken(accessToken);
        
        if (!payload) {
          return res.status(401).json({ message: "Invalid access token" });
        }
    
        const refreshedPayload = await verifyRefreshToken(refreshToken);
    
        if (!refreshedPayload) {
          return res.status(401).json({ message: "Invalid refresh token" });
        }
    
        const user = await User.findOneAndUpdate(
          { _id: refreshedPayload.id },
          {   $set: {
            "tokens.$.refreshToken": refreshToken.token,
        }, }
        );
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
       
        const newAccessToken = await signAccessToken(refreshedPayload);
    
        return res.status(200).json({ 
            status: 200,
            message: "Token refresh successfully",
            accessToken: newAccessToken 
        });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
}
module.exports = {
    addUser,
    login,
    resetPassword,
    refreshToken,
    verifyOTP
}