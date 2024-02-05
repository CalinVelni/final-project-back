import {model, Schema, SchemaType} from "mongoose";

const genreSchema = new Schema({

});

const Genre = model("Genre", genreSchema);

export default Genre