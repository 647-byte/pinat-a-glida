/**
 * @file Controllers for the /products routes. Reading products is public;
 * changes are admin only. Every product is returned with its option groups
 * (populate('options')).
 */
import Product from "../models/products.model.js";
/**
 * GET /products - returns all products.
 * @param {import('express').Request} req - The request.
 * @param {import('express').Response} res - 200 with an array of products.
 * @param {import('express').NextFunction} next - Receives errors.
 */
const getAllProducts = async (req, res, next) => {
    try {
        const result = await Product.find().populate('options');
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}
/**
 * GET /products/:id - returns one product.
 * @param {import('express').Request} req - req.params.id is the product's id.
 * @param {import('express').Response} res - 200 with the product.
 * @param {import('express').NextFunction} next - Receives errors (404 if not found).
 */
const getSpecificProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const found = await Product.findById(id).populate('options');
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
/**
 * GET /products/popular - returns the products marked as popular for the
 * home page. When none are marked, returns up to 8 products instead.
 * @param {import('express').Request} req - The request.
 * @param {import('express').Response} res - 200 with an array of products.
 * @param {import('express').NextFunction} next - Receives errors (404 when there are no products at all).
 */
const getPopularProducts = async (req, res, next) => {
    try {
        let products = await Product.find({ isPopular: true }).populate('options');
        if (!products || products.length === 0) {
            products = await Product.find().populate('options').limit(8);
        }
        if (!products || products.length === 0) {
            const error = new Error("לא נמצאו מוצרים במערכת");
            error.status = 404;
            error.type = "not_found";
            return next(error);
        }
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};
/**
 * POST /products - creates a product (admin only).
 * @param {import('express').Request} req - Body: the product's fields (validated by productSchema).
 * @param {import('express').Response} res - 201 with the new product.
 * @param {import('express').NextFunction} next - Receives errors.
 */
const addProduct = async (req, res, next) => {
    try {
        // No validation needed here: productSchema already checked the body
        const newProduct = new Product(req.body);
        await newProduct.save();
        const result = await Product.findById(newProduct._id).populate('options');
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}
/**
 * DELETE /products/:id - deletes a product (admin only). Past orders keep
 * the product's name, so they still display correctly.
 * @param {import('express').Request} req - req.params.id is the product's id.
 * @param {import('express').Response} res - 200 with the deleted product.
 * @param {import('express').NextFunction} next - Receives errors (404 if not found).
 */
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const found = await Product.findByIdAndDelete(id).populate('options');
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
/**
 * PUT /products/:id - replaces a product's fields (admin only).
 * @param {import('express').Request} req - req.params.id is the product's id; body: the product's fields (validated by productSchema).
 * @param {import('express').Response} res - 200 with the updated product.
 * @param {import('express').NextFunction} next - Receives errors (404 if not found).
 */
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const found = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate('options');
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
/**
 * PATCH /products/:id - updates a product's stock (admin only).
 * - quantity (number): ADDED to the current stock; availability is then
 *   set from the new quantity.
 * - isAvailable (boolean): used when no quantity is sent, for products
 *   without a managed quantity.
 * @param {import('express').Request} req - req.params.id is the product's id; body: { quantity?, isAvailable? }.
 * @param {import('express').Response} res - 200 with the updated product.
 * @param {import('express').NextFunction} next - Receives errors (400 when neither field is valid, 404 if not found).
 */
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
        const found = await Product.findById(id).populate('options');
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
export { getAllProducts, getSpecificProduct, addProduct, deleteProduct, updateProduct, updateQuantity,getPopularProducts }