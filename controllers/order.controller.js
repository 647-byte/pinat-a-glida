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
export {getAllOrders};