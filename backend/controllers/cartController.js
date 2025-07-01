import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const addToCart = async (req, res) => {
    try {

        const { userId, itemId, size } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Added ToCart" });

           } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;
        
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "cart updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}



const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        res.json({ success: true, cartData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


export { addToCart, updateCart, getUserCart };

















        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const token = req.headers.token;

        // if (!token) {
        //     return res.status(401).json({ success: false, message: "No token provided" });
        // }

        // if (!userData) {
        //     return res.status(404).json({ success: false, message: "User not found" });
        // }