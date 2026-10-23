import Order from '../models/order.model.js';
import { buildOrderItems, decreaseStock } from "../services/order.service.js";
const getAllOrders = async (req, res, next) => {
    try {
        //populate נועד כדי להמיר את ה ID ששמור בפרטים הרלוונטיים
        const orders = await Order.find().populate('userId', 'name email').populate('items.productId', 'imageUrl');
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};
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
const getUserOrders = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId }).populate('items.productId', 'imageUrl');;
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};
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
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { statusOrder } = req.body;

        // רשימת הסטטוסים החוקיים במערכת
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
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate('items.productId', 'imageUrl');
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};
export { getAllOrders, getOrderById, getUserOrders, getMyOrders, createOrder, updateOrderStatus };