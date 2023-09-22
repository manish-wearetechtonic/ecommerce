const User = require("../Models/users.model");
const bcrypt = require("bcryptjs");

const {signAccessToken, signRefreshToken } = require("../Auth/auth");


/// Function for adding User 
const addUser = async (req, res) => {
    try {
        let {email, name, password, phone } = req.body;
        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(409).json({
                message: `User with ${email} is already exists`
            });
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const createUser = await User.create({
            name,
            email,
            password: hashPassword,
            phone
        })

        return res.json({
            message: "Your account created successfully!",
            _id:createUser._id
        })
    } catch (error) {

        return res.json({
            message: error.message
        })

    }
}

/// Function for login
const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        const user = await User.findOne({ email });

        console.log(`User try to login ${user}`);

        if (!user || !user.isAdmin === false) {
            return res.status(409).json({ message: "User not exist" });
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

// Reset password
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
          // Handle validation error (e.g., invalid newPassword or confirmPassword)
          return res.status(400).json({
            status: 400,
            message: error.message,
          });
        } else if (error.name === 'MongoError') {
          // Handle MongoDB-related error
          return res.status(500).json({
            status: 500,
            message: "MongoDB Error: " + error.message,
          });
        } else {
          // Handle other unexpected errors
          console.error("Unexpected Error:", error);
          return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
          });
        }
      }
}
module.exports = {
    addUser,
    login,
    resetPassword
}