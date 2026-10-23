import { model, Schema } from "mongoose";
const optionGroupSchema = new Schema(
    {
        title: { type: String, required: true, trim: true }, // למשל: "שוקולדים", "תוספות לגלידה"
        isMust: { type: Boolean, default: false },
        maxChoices: { type: Number, required: true, min: 1 },
        pricePer: { type: Number, default: 0, min: 0 },
        choices: [{ type: String, trim: true }] // ['לוטוס', 'אוראו', 'קינדר']
    },
    { timestamps: true }
);
const OptionGroup = model('OptionGroup', optionGroupSchema);
export default OptionGroup;