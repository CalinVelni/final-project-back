import {model, Schema, SchemaTypes} from "mongoose";

const publisherSchema = new Schema({
    name: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 99,
        required: true,
        unique: true
    },
    games: {
        type: Array,
        default: []
    },
    founded_by: {
        type: SchemaTypes.ObjectId,
        ref: "User"
    },
    slug: {
        type: String,
        unique: true,
        index: true
    }

}, { timestamps: true });

const Publisher = model("Publisher", publisherSchema);

export default Publisher