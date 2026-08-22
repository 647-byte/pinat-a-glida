import { isValidObjectId } from "mongoose";
import Product from "../models/products.model.js";
const getAllProducts = async (req, res, next) => {
    try {
        const result = await Product.find();
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}
const getSpecificProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            //כאן לטפל בשגיאה
        }
        const found = await Product.findById(id);
        if (!found) {
            //בהמשך למלא
        }
        res.status(200).json(found);
    }
    catch (err) {
        next(err);
    }
}
const addProduct = async (req, res, next) => {
    try {
        //אין צורך לעשות בדיקות תקינות כאן כי זה יעשה כבר ע"י JOI 
        const newProduct = new Product(req.body);
        const result = await newProduct.save();
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            //כאן לטפל בשגיאה
        }
        const found = await Product.findByIdAndDelete(id);
        if (!found) {
            //כאן לטפל בשגיאה
        }
        res.status(200).json(found);
    }
    catch (err) {
        next(err);
    }
}
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            //כאן לטפל בשגיאה
        }
        const found = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!found) {
            //כאן לטפל בשגיאה
        }
        res.status(200).json(found);
    } catch (err) {
        next(err);
    }
}
export { getAllProducts, getSpecificProduct, addProduct, deleteProduct, updateProduct }