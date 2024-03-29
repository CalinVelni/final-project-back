import { genToken } from "../library/authFunctions.js";
import express from "express";
import User from "../models/User.js";

// ROUTER SET UP
const router = express.Router();

// AUTHENTICATION SIGN UP
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).send('email and password required.')
    }
    try {
        const user = await User.signUp(email, password, req.body.type);
        const { _id, type } = user;
        const token = genToken({ _id, type });
        return res.status(201).send({
            user,
            token
        })
    } catch(e) {
        console.error(e);
        const code = e.statusCode || 500;
        return res.status(code).send(e.message)
    }
});

// AUTHENTICATION LOG IN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).send('email and password required.')
    }
    try {
        const user = await User.logIn(email, password);
        const { _id, type } = user;
        const token = genToken({ _id, type });
        return res.status(201).send({
            user,
            token
        })
    } catch(e) {
        console.error(e);
        const code = e.statusCode || 500;
        return res.status(code).send(e.message)
    }
});

export default router