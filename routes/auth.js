import { genToken } from "../library/authFunctions.js";
import express from "express";
import User from "../models/User.js";

// ROUTER SET UP
const router = express.Router();

// AUTHENTICATION (POST)
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).send('email and password required.')
    }
    try {
        const user = await User.signUp(email, password);
        const { _id, type } = user;
        const token = genToken({ _id, type });
        return res.status(201).send({
            user,
            token
        })
    } catch(err) {
        console.error(err);
        const code = err.statusCode || 500;
        return res.status(code).send(err.message)
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).send('email and password required.')
    }
    try {
        const user = await User.logIn(email, password);
        const token = genToken(user._id);
        return res.status(201).send({
            user,
            token
        })
    } catch(err) {
        console.error(err);
        const code = err.statusCode || 500;
        return res.status(code).send(err.message)
    }
});

export default router