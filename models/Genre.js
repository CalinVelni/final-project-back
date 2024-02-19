import {model, Schema, SchemaType} from "mongoose";

const genreSchema = new Schema({
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
    }
}, {timestamps: true});

const Genre = model("Genre", genreSchema);

export default Genre