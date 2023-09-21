const User = require("../Models/users.model");
const bcrypt = require("bcrypt");

const {signAccessToken, signRefreshToken } = require("../Auth/auth");


/// Function for adding Admin 
const adminSignup = async (req, res) => {
    try {
        let {email, name, password, phone } = req.body;
        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(409).json({
                message: `Admin with ${email} is already exists`
            });
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const createUser = await User.create({
            name,
            email,
            password: hashPassword,
            phone,
            isAdmin:true
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

        if (!user || user.isAdmin === false) {
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

module.exports = {
    adminSignup,
    login
}