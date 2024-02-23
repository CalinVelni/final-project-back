import bcrypt from "bcrypt";
import dotenv from "dotenv"; dotenv.config();
import jwt from "jsonwebtoken";
const { PEPPER_KEY, SECRET_KEY, ADMIN_KEY } = process.env;

export const hashPsw = async (psw) => {
    const salt = await bcrypt.genSalt(12);
    const pepperedPsw = PEPPER_KEY + psw;
    const hashedPsw = bcrypt.hash(pepperedPsw, salt)
    return hashedPsw
};

export const comparePsw = async (psw, hashedPsw) => {
    const pepperedPsw = PEPPER_KEY + psw;
    const match = await bcrypt.compare(pepperedPsw, hashedPsw);
    return match
};

export const genToken = ({_id, type}) => {
    const token = jwt.sign(
        { _id, type },
        SECRET_KEY,
        { expiresIn: '3d' }
    );
    return token
};

export const requireAuth = () => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            const token = authorization?.split(' ')[1];
            if(!token) {
                throw new Error('Token required.')
            }
            jwt.verify(token, SECRET_KEY)
        } catch(err) {
            console.error(err);
            return res.status(401).send(`Request is not authorized: ${err.message}`)
        }
        next()
    }
};

export const requireDev = () => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            const token = authorization?.split(' ')[1];
            if(!token) {
                throw new Error('Token required.')
            }
            jwt.verify(token, SECRET_KEY);
            const { type } = jwt.decode(token); // Getting the user type from payload decoding the token
            if (type !== 'developer') {
                throw new Error('You must be a developer.') 
            }
        } catch(err) {
            return res.status(401).send(`Request is not authorized: ${err.message}`)
        }
        next()
    }
};

export const requireAdminKey = () => {
    return async (req, res, next) => {
        try {
            const { admin } = req.headers;
            const key = admin?.split(' ')[1];
            if( !key || key !== ADMIN_KEY ) {
                throw new Error(`Request is not authorized.`)
            }
        } catch(err) {
            return res.status(401).send(`Request is not authorized.`)
        }
        next()
    }
};
