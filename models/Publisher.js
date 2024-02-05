import {model, Schema, SchemaType} from "mongoose";

const publisherSchema = new Schema({

});

const Publisher = model("Publisher", publisherSchema);

export default Publisher