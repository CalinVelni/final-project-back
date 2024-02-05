import {model, Schema, SchemaType} from "mongoose";

const userSchema = new Schema({

});

const User = model("User", userSchema);

export default User