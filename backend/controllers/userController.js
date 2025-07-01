import userModel from '../models/userModel.js';
import validator from 'validator';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//A function to generate TOKEN
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

//Route for user login
const loginUser = async (req, res) => {
    try {
        //get the email and password from the request bpdy
        const { email, password } = req.body;

        //check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {//The user is not existing
            return res.json({ success: false, message: "This user does not exist" })
        }
        //Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });

    }

}

//Route for Register user
const registerUser = async (req, res) => {
    try {
        //get the name , email and password from the request body
        const { name, email, password } = req.body;//Object format

        //Check if the user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        //validate the email format and password strength and length
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password is weak, please enter a strong password" });
        }

        //Use the byCrypt library to hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create the user
        const newUser = new userModel({
            name, email, password: hashedPassword
        })

        //save the user to the database
        const user = await newUser.save();

        //create the token for the user
        const token = createToken(user._id);

        //Set the token as a response
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//Route for admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });

    }
}



export { loginUser, registerUser, adminLogin };