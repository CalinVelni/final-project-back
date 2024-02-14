import { model, Schema } from "mongoose";
import { isEmail, isStrongPassword } from "validator";

const userSchema = new Schema({
    first_name: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 99,
        required: true,
    },
    last_name: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 99,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        minLength: 5,
        maxLength: 320,
        validate: {
            validator: value => isEmail(value),
            message: props => `${props.value} is not a valid email.`
        },
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 999,
        validate: {
            validator: value => isStrongPassword(value, { minLength:8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1 }),
            message: props => `The password is not strong enough.`
        },
        required: true,
    },
}, {timestamps: true});

const User = model("User", userSchema);

export default User