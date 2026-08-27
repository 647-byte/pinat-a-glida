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
        const found = await Product.findById(id);
        if (!found) {
            const error = new Error("המוצר אינו נמצא");
            error.status = 404;
            error.type = "not_found";
            return next(error);
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
        const found = await Product.findByIdAndDelete(id);
        if (!found) {
            const error = new Error("המוצר אינו נמצא");
            error.status = 404;
            error.type = "not_found";
            return next(error);
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
        const found = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!found) {
            const error = new Error("המוצר אינו נמצא");
            error.status = 404;
            error.type = "not_found";
            return next(error);
        }
        res.status(200).json(found);
    } catch (err) {
        next(err);
    }
}
const updateQuantity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity, isAvailable } = req.body;
        if (typeof isAvailable !== "boolean" && typeof quantity !== "number") {
            const error = new Error("הנתונים שהתקבלו שגויים");
            error.status = 400;
            error.type = "bad_request";
            return next(error);
        }
        const found = await Product.findById(id);
        if (!found) {
            const error = new Error("המוצר אינו נמצא");
            error.status = 404;
            error.type = "not_found";
            return next(error);
        }
        if (typeof quantity === "number") {
            found.quantity += quantity;
            found.isAvailable = found.quantity > 0;
        }
        else found.isAvailable = isAvailable;
        await found.save();
        return res.status(200).json(found);
    } catch (err) {
        next(err);
    }
}
export { getAllProducts, getSpecificProduct, addProduct, deleteProduct, updateProduct, updateQuantity }