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
    slug: {
        type: String,
        unique: true,
        index: true
    }

}, { timestamps: true });

// SLUG GENERATOR METHOD
publisherSchema.methods.slugGen = async function () {
    const Publisher = this.constructor;
    const basicSlug = this.name.replaceAll(' ', '-').toLowerCase();
    let slugAlreadyUsed = true;
    let slug = basicSlug;
    let i = 1;
    while(slugAlreadyUsed) {
        slugAlreadyUsed = await Publisher.exists({slug});
        if(slugAlreadyUsed) {
            slug = basicSlug + '-' + i;
            i ++
        }
    }
    this.slug = slug
};

const Publisher = model("Publisher", publisherSchema);

export default Publisher