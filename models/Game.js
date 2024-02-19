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
        ref: "Genre"
    },
    description: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 99999,
    },
    cover: {
        type: String,
        minLength: 1,
        maxLength: 9999,
        default: 'https://www.wallpapertip.com/wmimgs/49-490546_retro-video-game-background.png'
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