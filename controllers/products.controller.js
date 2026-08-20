import Product from "../models/products.model.js";
const getAllProducts=async (req,res,next)=>{
    try{
    const result=await Product.find();
    res.status(200).json(result);
    }
    catch(err){
        next(err);
    }
}
export {getAllProducts}