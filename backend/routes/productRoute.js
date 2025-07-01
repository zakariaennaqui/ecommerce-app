import express from 'express';
import { addProduct , removeProduct , listProducts , singleProduct }   from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

//Create the product Router 
const productRouter = express.Router();

//Create multiple routes for the productRouter
productRouter.post('/add',adminAuth, upload.fields([{name:'image1', maxCount:1}, {name:'image2', maxCount:1}, {name:'image3', maxCount:1}, {name:'image4', maxCount:1}]), addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single' , singleProduct);
productRouter.get('/list' , listProducts);

//Export the productRouter
export default productRouter;