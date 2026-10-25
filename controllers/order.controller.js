/**
 * @file Controllers for the /orders routes. Prices and stock are always
 * calculated on the server (order.service), never taken from the client.
 */
import Order from '../models/order.model.js';
import { buildOrderItems, decreaseStock } from "../services/order.service.js";
/**
 * GET /orders - returns all orders, newest first, with the customer's name
 * and email and each product's image (admin only).
 * @param {import('express').Request} req - The request.
 * @param {import('express').Response} res - 200 with an array of orders.
 * @param {import('express').NextFunction} next - Receives errors.
 */
const getAllOrders = async (req, res, next) => {
    try {
        // Newest first; populate replaces the stored ids with the related details
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email')
            .populate('items.productId', 'imageUrl');
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};
/**
 * GET /orders/:id - returns one order. A customer may view only her own
 * orders; an admin may view any order.
 * @param {import('express').Request} req - req.params.id is the order's id; req.user is set by authenticate.
 * @param {import('express').Response} res - 200 with the order.
 * @param {import('express').NextFunction} next - Receives errors (404 if not found, 403 for another customer's order).
 */
const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('items.productId', 'imageUrl');
        if (!order) {
            const error = new Error("ההזמנה לא נמצאה");
            error.status = 404;
            error.type = "not_found";
            return next(error);
        }
         if (req.user.role !== "admin" && order.userId.toString() !== req.user.id) {
            const error = new Error("אין לך הרשאה לצפות בהזמנה זו");
            error.status = 403;
            error.type = "forbidden";
            return next(error);
        }
        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};
/**
 * GET /orders/user/:userId - returns a user's orders, newest first (admin only).
 * @param {import('express').Request} req - req.params.userId is the user's id.
 * @param {import('express').Response} res - 200 with an array of orders.
 * @param {import('express').NextFunction} next - Receives errors.
 */
const getUserOrders = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .populate('items.productId', 'imageUrl');
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};
/**
 * POST /orders - places an order for the signed-in customer.
 * buildOrderItems checks every product, size and choice and calculates the
 * prices; stock is reduced only after the order is saved.
 * @param {import('express').Request} req - Body: { items, customerDetails, comments? } (validated by orderSchema).
 * @param {import('express').Response} res - 201 with the saved order, including totalPrice.
 * @param {import('express').NextFunction} next - Receives errors (400 with a Hebrew message for invalid items or missing stock).
 */
const createOrder = async (req, res, next) => {
    try {
        const { items, totalPrice, neededQuantity } = await buildOrderItems(req.body.items);
        const newOrder = new Order({
            items,
            totalPrice,
            customerDetails: req.body.customerDetails,
            comments: req.body.comments,
            userId: req.user.id
        });
        const savedOrder = await newOrder.save();
        await decreaseStock(neededQuantity);
        res.status(201).json(savedOrder);
    } catch (err) {
        next(err);
    }
};
/**
 * PATCH /orders/:id/status - changes an order's status (admin only).
 * @param {import('express').Request} req - req.params.id is the order's id; body: { statusOrder }.
 * @param {import('express').Response} res - 200 with the updated order.
 * @param {import('express').NextFunction} next - Receives errors (400 for an unknown status, 404 if not found).
 */
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { statusOrder } = req.body;

        // The statuses an order can have (same as the enum in order.model)
        const validStatuses = ['pending', 'preparing', 'on_the_way', 'delivered'];
        if (!validStatuses.includes(statusOrder)) {
            const error = new Error("סטטוס הזמנה לא חוקי");
            error.status = 400;
            error.type = "bad_request";
            return next(error);
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { statusOrder },
            { new: true }
        );

        if (!updatedOrder) {
            const error = new Error("ההזמנה לא נמצאה");
            error.status = 404;
            error.type = "not_found";
            return next(error);
        }

        res.status(200).json(updatedOrder);
    } catch (err) {
        next(err);
    }
};
/**
 * GET /orders/my - returns the signed-in customer's own orders, newest first.
 * @param {import('express').Request} req - req.user is set by authenticate.
 * @param {import('express').Response} res - 200 with an array of orders.
 * @param {import('express').NextFunction} next - Receives errors.
 */
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .populate('items.productId', 'imageUrl');
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};
export { getAllOrders, getOrderById, getUserOrders, getMyOrders, createOrder, updateOrderStatus };