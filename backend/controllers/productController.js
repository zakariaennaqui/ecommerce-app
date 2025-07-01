import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js';

//Function to add products
const addProduct = async(req, res)=>{
    try {
        const { name ,description ,price ,category ,subCategory ,sizes ,bestseller } = req.body;

        //get the images from the request
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
       
        //filter out the undefined images
        const images = [image1, image2, image3, image4].filter(item=>item !== undefined);

        //uplaod all the images on the cloudinary 
        const imagesUrl = await Promise.all(images.map(async(item)=>{
            const result = await cloudinary.uploader.upload(item.path, {resource_type:'image'})
            return result.secure_url;
        }));

      const productData = {
         name,
         description, 
         category, 
         price:Number(price), //convert the price string to number
         subCategory,
         //bestseller:bestseller === "true" ? true :false,
         bestseller: bestseller === "true",
         sizes:JSON.parse(sizes), //convert the sizes string to array 
         image:imagesUrl, //store the images url
         date:Date.now() //store the current date
      }

      //create a new product
      const product = new productModel(productData);

     //save the product in the database 
     await product.save();
     res.json({success:true, message:"Product added successfully"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//function to list products
const listProducts = async(req, res)=>{
    try {
        //Get all the products from the database
        const products = await productModel.find({});
        res.json({success:true, products});
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//function to remove products
const removeProduct = async(req, res)=>{
    try {

        //find the product by id and remove it from the database
        await productModel.findByIdAndDelete(req.body.id);//Or you can use the code:await prodcuctModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:"Product removed successfully"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//function for single product info
const singleProduct = async(req, res)=>{
    try {
        //Get the id of the product from the request
        const {productId} = req.body;
        
        //find the product by id from the database
        const product = await productModel.findById(productId);

        //Getting the res
        res.json({succes:true, product})
    } catch (error) {
        console.log(error)
        res.json({succes:false, message:error.message})
    }
}

export {addProduct, removeProduct, listProducts, singleProduct}