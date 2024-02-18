import { requireDev } from "../library/authFunctions.js";
import express from "express";
import Game from "../models/Game.js";
import Publisher from "../models/Publisher.js";

const router = express.Router();

// READ PUBLISHERS LIST
router.get('/', async (req, res) => {
    try {
        const publishersList = await Publisher.find();
        res.send(publishersList);
    } catch(e) {
        res.status(500).send(e)
    }
});

// READ SINGLE PUBLISHER
router.get('/:slug', async (req, res) => {
    try {
        const publisher = await Publisher.findOne({ slug: req.params.slug }).populate('games', 'title cover slug');
        res.send(publisher);
        if (publisher === null) {
            throw new Error('Not found')
        }
        publisher.games = await Game.find({ publisher: publisher._id });
        res.send(publisher);
    } catch(e) {
        res.status(404).send(e)
    }
});

// MIDDLEWARE FOR DEVELOPER USERS AUTHORIZATION
router.use(requireDev());

// CREATE A PUBLISHER
router.post('/', async ( req, res) => {
    try {
        if(!req.body) {
            throw new Error('You must send a valid body.');
        }
        const publisher = new Publisher(req.body);
        await publisher.slugGen();
        publisher.games = [];
        await publisher.save();
        const publishersList = await Publisher.find();
        res.send(publishersList)
    } catch(e) {
        res.status(400).send(e)
    }
});

// UPDATE A PUBLISHER
router.patch('/:slug', async ( req, res) => {
    try {
        if(!req.body || !Object.keys(req.body).length) {
            throw new Error('You must send a body with at least one property.');
        }
        const publisher = await findOne({slug: req.params.slug});
        const isNameUpdated = publisher.name !== req.body.name;
        Object.entries(req.body).forEach(([key, value]) => {
            if(key !== 'slug' && key !== 'games') {
                publisher[key] = value
            }
        });
        if(isNameUpdated) {
            await publisher.slugGen();
        }
        publisher.games = [];
        await publisher.ave();
        const pubUpdated = await Publisher.findOne({slug: publisher.slug}).populate('games', 'title cover slug');
        pubUpdated.games = await Game.find({publisher: pubUpdated._id});
        res.send(pubUpdated) 
    } catch(e) {
        res.status(400).send(e)
    }
});

// DELETE A PUBLISHER
router.delete('/:slug', async (req, res) => {
    try {
        await Publisher.findOneAndDelete({slug: req.params.slug});
        const publishersList = await Publisher.find();
        res.send(publishersList);
    } catch(e) {
        res.status(404).send(e)
    }
});


export default router