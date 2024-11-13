const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user");

const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
   
        const finduser = await User.findOne({ email });
        if (finduser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            message: "Signup was successful!",
            userId: newUser._id
        });

    } catch (error) {
        console.error("Signup Error:", error);  
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "Incorrect email or password!" });
        }

        const compare = await bcrypt.compare(password, existingUser.password);
        if (!compare) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        return res.status(200).json({
            message: "Login successful!",
            userId: existingUser._id
        });

    } catch (error) {
        console.error("Login Error:", error);  
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { signup, login };
