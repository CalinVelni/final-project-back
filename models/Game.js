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
        required: true
    },
    genre: {
        type: SchemaTypes.ObjectId,
        ref: "Genre",
        required: true
    },
    description: {
        type: String,
        trim: true,
        maxLength: 9999,
        default: 'Not Available'
    },
    cover: {
        type: String,
        trim: true,
        maxLength: 999,
        default: 'https://source.unsplash.com/random/500x500/?videogame'
    },
    slug: {
        type: String,
        unique: true,
        index: true
    }
}, { timestamps: true });

// SLUG GENERATOR METHOD
gameSchema.methods.slugGen = async function () {
    const Game = this.constructor;
    const basicSlug = this.title.replaceAll(' ', '-').toLowerCase();
    let slugAlreadyUsed = true;
    let slug = basicSlug;
    let i = 1;
    while(slugAlreadyUsed) {
        slugAlreadyUsed = await Game.exists({slug});
        if(slugAlreadyUsed) {
            slug = basicSlug + '-' + i;
            i ++
        }
    }
    this.slug = slug
};

const Game = model("Game", gameSchema);

export default Game