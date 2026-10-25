/**
 * @file Order model. Each item keeps a copy of the product's name, price,
 * size and choices at the time of the order, so past orders stay correct
 * even if a product is changed or deleted later.
 */
import { model, Schema } from "mongoose";
/** The size chosen for an item, with its price at the time of the order. */
const sizeSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
    },
    { _id: false });
/** The choices made in one option group, with the group's price per extra choice. */
const optionsSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        pricePer: { type: Number, default: 0, min: 0 },
        selectedChoices: [{ type: String, required: true, trim: true }]
    },
    { _id: false });
/** One ordered product. price is the unit price, including extra choices. */
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
/** Delivery address. */
const addressSchema = new Schema(
    {
        city: { type: String, required: true, trim: true },
        street: { type: String, required: true, trim: true },
        numberHouse: { type: String, required: true, trim: true }
    },
    { _id: false })
/** The customer's delivery details for this order. */
const customSchema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        address: { type: addressSchema, required: true },
        phone: { type: String, required: true,trim: true }
    },
    { _id: false })
/** An order: the customer, items, delivery details, total and status. */
const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [itemSchema], required: true},
    customerDetails: { type: customSchema, required: true },
    totalPrice: { type: Number, required: true, default: 0, min: 0 },
    comments: { type: String },
    statusOrder: {
        type: String,
        enum: ['pending', 'preparing', 'on_the_way', 'delivered'],
        default: 'pending'
    }
},
    { timestamps: true })
const Order = model('Order', orderSchema);
export default Order;