import {model, Schema, SchemaTypes} from "mongoose";

const gameSchema = new Schema({
    title: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 999,
        required: true
    },
    publisher: {
        type: SchemaTypes.ObjectId,
        ref: "Publisher",
    },
    description: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 99999,
    },
    images: {
        type: Array,
    },
    slug: {
        type: String,
        unique: true,
        index: true
    }
}, { timestamps: true });

const Game = model("Game", gameSchema);

export default Game