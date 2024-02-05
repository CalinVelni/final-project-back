import authRouter from "./routes/auth.js";
import cors from "cors";
import dotenv from "dotenv"; dotenv.config();
import gamesRouter from "./routes/games.js";
import genresRouter from "./routes/genres.js";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import publishersRouter from "./routes/publishers.js";
import usersRouter from "./routes/users.js";
const { MONGO_URI } = process.env;
const PORT = process.env.PORT || 3000;

// SERVER SETUP
const app = express();
app.use(cors({origin:"*"}));
app.use(express.json());
app.use(morgan("dev"));

// ROUTES
app.use('/auth', authRouter);
// Insert verify-auth function
app.use('/games', gamesRouter);
app.use('/genres', genresRouter);
app.use('/publishers', publishersRouter);
app.use('/users', usersRouter);


// DATABASE AND SERVER RUN
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully.');
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}.`);
        });
    }).catch(e => console.error(e));