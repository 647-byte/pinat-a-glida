import { model, Schema } from "mongoose";
const sizeSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        maxChoices: { type: Number, min: 1 }
    },
    { _id: false });
const optionsSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        isMust: { type: Boolean, default: true },
        maxChoices: { type: Number, required: true, min: 1 },
        pricePer: { type: Number, default: 0, min: 0 },
        choices: [{ type: String, trim: true }]
    },
    { _id: false });
const productSchema = new Schema(
    {
        name: { type: String, unique: true, required: true, trim: true },
        price: { type: Number, required: true, default: 0, min: 0 },
        description: { type: String, trim: true },
        category: { type: String, required: true, trim: true },
        imageUrl: { type: String, required: true, trim: true },
        isAvailable: { type: Boolean, default: true },
        quantity: { type: Number, min: 0, default: null },
        size: { type: [sizeSchema] },
        options: { type: [optionsSchema] }
    },
    { timestamps: true }
)
const Product = model('Product', productSchema);
export default Product;