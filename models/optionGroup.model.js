/**
 * @file Option group model: a group of choices a product can offer, such as
 * flavors or toppings. maxChoices are included in the price; every extra
 * choice costs pricePer. When limitedBySize is true, the selected size's
 * maxChoices is used instead.
 */
import { model, Schema } from "mongoose";
const optionGroupSchema = new Schema(
    {
        title: { type: String, required: true, trim: true }, // e.g. "טעמים", "תוספות"
        isMust: { type: Boolean, default: false },
        maxChoices: { type: Number, required: true, min: 1 },
        pricePer: { type: Number, default: 0, min: 0 },
        limitedBySize: { type: Boolean, default: false },
        choices: [{ type: String, trim: true }] // e.g. ['לוטוס', 'אוראו']
    },
    { timestamps: true }
);
const OptionGroup = model('OptionGroup', optionGroupSchema);
export default OptionGroup;