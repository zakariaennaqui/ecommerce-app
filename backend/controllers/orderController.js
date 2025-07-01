import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe'
import razorpay from 'razorpay'

// global variables
const currency = 'mad'
const deliveryCharge = 10

//gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

//Placing orders using COD Method 
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        
        const orderData = {
            userId,
            items,
            amount,
            paymentMethod: "COD",
            payment: false,
            address,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, {cartData:{}});

        res.json({success:true, message: "Order Placed" });
    } catch (error) {
         console.log(error);
         res.json({success:false, message:error.message});
    }
}

//Placing order using Stripe method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const {origin} = req.headers;
        const orderData = {
            userId,
            items,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            address,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency:currency,
                product_data:{
                    name:item.name,
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))
        line_items.push({
            price_data: {
                currency:currency,
                product_data:{
                    name:'Delivery charges',
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })
        res.json({success:true, session_url:session.url});
            
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

//Verify Stripe
const verifyStripe = async (req, res) => {
    const {orderId, success, userId} = req.body
    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        }else{
            await orderModel.findByIdAndUpdate(orderId);
            res.json({success: false});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

//Placing order using Razorpay method 
const placeOrderRazorpay = async (req, res) => {
    try {

        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            address,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        }

        await razorpayInstance.orders.create(options, (error, order)=>{
            if(error){
                console.log(error);
                return res.json({success:false, message:error});
            }
            res.json({success:true, order})
        })
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData:{}})
            res.json({success:true, message:'Payment successful'});
            
        }else{
            res.json({success:false, message:'Payment failed'});
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}


//Display all the orders to the admin
const allOrders = async (req, res) => {
    try {

        const orders = await orderModel.find({})
        res.json({success:true,orders})

        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

//User order data for frontend
const userOrders = async (req, res) => {
    try {

        const {userId} = req.body
        const orders = await orderModel.find({userId})
        res.json({success:true, orders})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

//Update order status
const updateStatus = async (req, res) => {

    try {

        const {orderId, status} = req.body

        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success:true, message:'status updated'})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }

}

export { verifyRazorpay, verifyStripe, placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus };