/**
 * @file User model. Passwords are hashed before saving and are never
 * included when a user is sent to the client.
 */
import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

/**
 * A site user: a customer or an admin.
 * The email is unique and stored in lowercase, so lookups are case-insensitive.
 */
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


/**
 * Hashes the password with bcrypt before saving, only when it was set or
 * changed, so saving other fields does not hash the hash again.
 */
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Removes the password hash and the version key whenever a user is turned
 * into JSON, e.g. in res.json(user).
 */
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});

const User = model('User', userSchema);
export default User;