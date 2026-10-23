import { model, Schema } from "mongoose";
const sizeSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        maxChoices: { type: Number, min: 1 }
    },
    { _id: false });

const productSchema = new Schema(
    {
        name: { type: String, unique: true, required: true, trim: true },
        price: { type: Number, required: true, default: 0, min: 0 },
        description: { type: String, trim: true },
        imageUrl: { type: String, required: true, trim: true },
        isAvailable: { type: Boolean, default: true },
        quantity: { type: Number, min: 0, default: null },
        size: { type: [sizeSchema] },
        options: [{ type: Schema.Types.ObjectId, ref: 'OptionGroup' }],
        isPopular: { type: Boolean, default: false }
    },
    { timestamps: true }
)
const Product = model('Product', productSchema);
export default Product;