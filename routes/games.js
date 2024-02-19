import { requireDev } from "../library/authFunctions.js";
import express from "express";
import Game from "../models/Game.js";

const router = express.Router();

// READ GAMES LIST
router.get('/', async (req, res) => {
    try {
        const gamesList = await Game.find().populate('publisher', 'name').populate('genre', 'name');
        res.send(gamesList);
    } catch(e) {
        res.status(500).send(e.message)
    }
});


// READ SINGLE GAME
router.get('/:slug', async (req, res) => {
    try {
        const game = await Game.findOne({ slug: req.params.slug }).populate('publisher', 'name country').populate('genre', 'name');
        if (game === null) {
            throw new Error('Not found.')
        }
        res.send(game);
    } catch(e) {
        res.status(404).send(e.message)
    }
});

// MIDDLEWARE FOR DEVELOPER USERS AUTHORIZATION
router.use(requireDev());

// CREATE A GAME
router.post('/', async ( req, res) => {
    try {
        if(!req.body) {
            throw new Error('You must send a valid body.');
        }
        const game = new Game(req.body);
        await game.slugGen();
        await game.save();
        const gamesList = await Game.find().populate('publisher', 'name').populate('genre', 'name');
        res.send(gamesList)
    } catch(e) {
        res.status(400).send(e.message)
    }
});

// UPDATE A GAME
router.patch('/:slug', async ( req, res) => {
    try {
        if(!req.body || !Object.keys(req.body).length) {
            throw new Error('You must send a body with at least one property.');
        }
        const game = await Game.findOne({slug: req.params.slug});
        if (game === null) {
            throw new Error('Not found.')
        }
        const isTitleUpdated = req.body.title && game.title !== req.body.title;
        Object.entries(req.body).forEach(([key, value]) => {
            if(key !== 'slug') {
                game[key] = value
            }
        });
        if(isTitleUpdated) {
            await game.slugGen();
        }
        await game.save();
        const gameUpdated = await Game.findOne({slug: game.slug}).populate('publisher', 'name').populate('genre', 'name');
        res.send(gameUpdated) 
    } catch(e) {
        res.status(400).send(e.message)
    }
});

// DELETE A GAME
router.delete('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const confirm = await Game.findOneAndDelete({ slug });
        if(!confirm) {
            throw new Error(`Cannot delete: game with slug ${slug} not found.`)
        }
        const gamesList = await Game.find().populate('publisher', 'name').populate('genre', 'name');
        res.send(gamesList);
    } catch(e) {
        res.status(404).send(e.message)
    }
});



export default router