import { model, Schema } from "mongoose";
const sizeSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
    },
    { _id: false });
const optionsSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        pricePer: { type: Number, default: 0, min: 0 },
        selectedChoices: [{ type: String, required: true, trim: true }]
    },
    { _id: false });
const itemSchema = new Schema(
    {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        nameItem: { type: String, required: true },
        price: { type: Number, required: true, default: 0, min: 0 },
        quantity: { type: Number, min: 1, default: 1 },
        size: { type: sizeSchema },
        options: { type: [optionsSchema] }
    },
    { _id: false })
const addressSchema = new Schema(
    {
        city: { type: String, required: true, trim: true },
        street: { type: String, required: true, trim: true },
        numberHouse: { type: String, required: true, trim: true }
    },
    { _id: false })
const customSchema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        address: { type: addressSchema, required: true },
        phone: { type: String, required: true,trim: true }
    },
    { _id: false })
const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [itemSchema], required: true},
    customerDetails: { type: customSchema, required: true },
    totalPrice: { type: Number, required: true, default: 0, min: 0 },
    comments: { type: String },
    statusOrder: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
},
    { timestamps: true })
const Order = model('Order', orderSchema);
export default Order;