import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true, minlength: 6 },
        phone: { type: String, trim: true },
        role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    },
    { timestamps: true }
);


userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});

const User = model('User', userSchema);
export default User;