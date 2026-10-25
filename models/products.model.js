/**
 * @file Product model. A product has either one price, or sizes with their
 * own prices; quantity null means the stock is not managed.
 */
import { model, Schema } from "mongoose";
/** A size option. maxChoices limits choices in groups marked limitedBySize. */
const sizeSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        maxChoices: { type: Number, min: 1 }
    },
    { _id: false });

/** A product on the menu. options are the ids of its option groups. */
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