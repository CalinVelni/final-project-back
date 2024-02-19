import { hashPsw, comparePsw } from "../library/authFunctions.js"
import { model, Schema } from "mongoose";
import validator from "validator";
const { isEmail, isStrongPassword } = validator;

const userSchema = new Schema({
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
    type: {
        type: String,
        enum: ['tester', 'developer'],
        default: 'tester'
    },
}, {timestamps: true});

// AUTHENTICATION FUNCTIONS
userSchema.statics.signUp = async function (email, password, type) {
    if (!isEmail(email)){
        throw new Error(`${email} is not a valid email.`) 
    }
    if (!isStrongPassword(password, { minLength:8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1 })) {
        throw new Error('Password is not strong enough.') 
    }
    const emailTaken = await this.exists({email});
    if (emailTaken) {
        const err = new Error(`${email} is already in use.`);
        err.statusCode = 401;
        throw err
    }
    const hashedPsw = await hashPsw(password);
    const user = await this.create({ email, password: hashedPsw, type });
    return user
};

userSchema.statics.logIn = async function (email, password) {
    const user = await this.findOne({email});
    const pswMatch = await comparePsw(password, user.password);
    if (!user || !pswMatch) {
        const err = new Error('Incorrect email or password.');
        err.statusCode = 401;
        throw err
    }
    return user
};

const User = model("User", userSchema);

export default User