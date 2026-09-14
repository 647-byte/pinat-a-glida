import Order from '../models/order.model.js';
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
export { getAllOrders, getOrderById, getUserOrders };