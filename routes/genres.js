import { requireAdminKey } from "../library/authFunctions.js";
import express from "express";
import Game from "../models/Game.js";
import Genre from "../models/Genre.js";

const router = express.Router();

// READ GENRES LIST
router.get('/', async (req, res) => {
    try {
        const genresList = await Genre.find();
        res.send(genresList);
    } catch(e) {
        res.status(500).send(e.message)
    }
});

// READ SINGLE GENRE
router.get('/:id', async (req, res) => {
    try {
        const genre = await Genre.findOne({ _id: req.params.id }).populate('games', 'title cover slug');
        if (genre === null) {
            throw new Error('Not found.')
        }
        genre.games = await Game.find({ genre: genre._id });
        res.send(genre);
    } catch(e) {
        res.status(404).send(e.message)
    }
});

// MIDDLEWARE FOR ADMIN AUTHORIZATION
router.use(requireAdminKey());

// CREATE A GENRE
router.post('/', async ( req, res) => {
    try {
        if(!req.body) {
            throw new Error('You must send a valid body.');
        }
        const genre = new Genre(req.body);
        genre.games = [];
        await genre.save();
        const genresList = await Genre.find();
        res.send(genresList)
    } catch(e) {
        res.status(400).send(e.message)
    }
});

// UPDATE A GENRE
router.patch('/:id', async ( req, res) => {
    try {
        if(!req.body || !Object.keys(req.body).length) {
            throw new Error('You must send a body with at least one property.');
        }
        const genre = await Genre.findOne({_id: req.params.id});
        Object.entries(req.body).forEach(([key, value]) => {
            if(key !== 'slug' && key !== 'games') {
                genre[key] = value
            }
        });
        genre.games = [];
        await genre.save();
        const genreUpdated = await Genre.findOne({_id: genre._id}).populate('games', 'title cover slug');
        genreUpdated.games = await Game.find({genre: genre._id});
        res.send(genreUpdated) 
    } catch(e) {
        res.status(400).send(e.message)
    }
});

// DELETE A GENRE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const confirm = await Genre.findOneAndDelete({ _id: id });
        if(!confirm) {
            throw new Error(`Cannot delete: genre with id ${id} not found.`)
        }
        const genresList = await Genre.find();
        res.send(genresList);
    } catch(e) {
        res.status(404).send(e.message)
    }
});

export default router