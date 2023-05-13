'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult, param, body} = require('express-validator'); // validation middleware
const filmDao = require('./filmDao'); // module for accessing the DB

// init express
const app = express();
const port = 3002;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

/*** APIs ***/
// GET /api/films
// params: filter
app.get('/api/films', [
    check('filter')
        .isIn(['filter-all', 'filter-favorite', 'filter-best', 'filter-lastmonth', 'filter-unseen',''])
    ],
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    //console.log(req.query);
    // check if there is a correct query string
    // for example the param should be 'filter' and not 'filte'
    if (!(Object.keys(req.query).length === 0
            || req.query.filter != undefined)) {
        return res.status(400).json({errors: 'Wrong query string!'});
    }
    
    filmDao.listFilms(req.query.filter)
        .then(films => res.json(films))
        .catch((err) => res.status(500).json(err));
});

// GET /api/films/:id
app.get('/api/films/:id', [
    param('id').isInt()
    ],
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    filmDao.filmById(req.params.id)
        .then(film => res.json(film))
        .catch((err) =>
            err.error == 'Film not found.' ? 
                res.status(404).json(err) 
                    : res.status(500).json(err));
});

// POST /api/films
app.post('/api/films', [
    check('title').isLength({min: 1}),
    check('favorite').isBoolean(),
    check('rating').isInt({min: 0, max: 5}),
    check('watchDate').isLength({min: 10, max: 10}).isISO8601({ strict: true }).optional({ checkFalsy: true }).not().isAfter()
    ],
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const film = {
        title: req.body.title,
        favorite: req.body.favorite,
        watchDate: req.body.watchDate,
        rating: req.body.rating,
        user : req.body.user
    };

    filmDao.createFilm(film)
        .then(film => res.status(201).json(film))
        .catch((err) => res.status(500).json(err));
});

// PUT /api/films/:id
app.put('/api/films/:id', [
    param('id').isInt(),
    check('title').isLength({min: 1}),
    check('favorite').isBoolean(),
    check('rating').isInt({min: 0, max: 5}),
    check('watchDate').isLength({min: 10, max: 10}).isISO8601({ strict: true }).optional({ checkFalsy: true }).not().isAfter()
    ],
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const film = {
        id: req.params.id,
        title: req.body.title,
        favorite: req.body.favorite,
        watchDate: req.body.watchDate,
        rating: req.body.rating,
        user : req.body.user
    };

    filmDao.updateFilm(film)
        .then((film) => res.status(200).json(film))
        .catch((err) => 
            err.error == 'Film not found.' ?
                res.status(404).json(err)
                    : res.status(500).json(err));
});

// PUT /api/films/:id/favorite
app.put('/api/films/:id/favorite', [
    param('id').isInt(),
    body('favorite').isBoolean()
    ],
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    filmDao.updateFavorite(req.params.id, req.body.favorite)
        .then((film) => res.status(200).json(film))
        .catch((err) =>
            err.error == 'Film not found.' ?
                res.status(404).json(err)
                    : res.status(500).json(err));
});

// PUT /api/films/:id/rating
app.put('/api/films/:id/rating', [
    param('id').isInt(),
    body('rating').isInt({min: 0, max: 5})
    ],
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    filmDao.updateRating(req.params.id, req.body.rating)
        .then((film) => res.status(200).json(film))
        .catch((err) =>
            err.error == 'Film not found.' ?
                res.status(404).json(err)
                    : res.status(500).json(err));
});

// DELETE /api/films/:id
app.delete('/api/films/:id', [
    param('id').isInt()
    ],
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    filmDao.deleteFilm(req.params.id)
        .then((film) => res.status(200).json(film))
        .catch((err) =>
            err.error == 'Film not found.' ?
                res.status(404).json(err)
                    : res.status(500).json(err));
});
/*** end APIs ***/

// Activate the server
app.listen(port, () => {
    console.log(`react-qa-server listening at http://localhost:${port}`);
  });