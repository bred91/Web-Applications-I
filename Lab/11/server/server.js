'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult, param, body } = require('express-validator'); // validation middleware
const filmDao = require('./filmDao'); // module for accessing the DB
const cors = require('cors'); // enable CORS
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the user info in the DB

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Incorrect username and/or password.' });

            return done(null, user);
        })
    }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    // it keeps the id of the user in users table as identifier for retrieving the user in deserializeUser
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});

// init express
const app = express();
const port = 3002;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions)); // NB: Usare solo per sviluppo e per l'esame! Altrimenti indicare dominio e porta corretti

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'Not authenticated' });
};

// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'saifhsjsadje8324',   //personalize this random string, should be a secret value
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());


/*** APIs ***/
// GET /api/films
// params: filter
app.get('/api/films', isLoggedIn, [
    check('filter')
        .isIn(['filter-all', 'filter-favorite', 'filter-best', 'filter-lastmonth', 'filter-unseen', ''])
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        //console.log(req.query);
        // check if there is a correct query string
        // for example the param should be 'filter' and not 'filte'
        if (!(Object.keys(req.query).length === 0
            || req.query.filter != undefined)) {
            return res.status(422).json({ errors: 'Wrong query string!' });
        }

        filmDao.listFilms(req.query.filter, req.user.id)
            .then(films => res.json(films))
            .catch((err) => res.status(500).json(err));
});

// // GET /api/films/:id
// app.get('/api/films/:id', [
//     param('id').isInt()
// ],
//     (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         filmDao.filmById(req.params.id)
//             .then(film => res.json(film))
//             .catch((err) =>
//                 err.error == 'Film not found.' ?
//                     res.status(404).json(err)
//                     : res.status(500).json(err));
//     });

// POST /api/films
app.post('/api/films', isLoggedIn, [
    check('title').isLength({ min: 1 }),
    check('favorite').isBoolean(),
    check('rating').isInt({ min: 0, max: 5 }),
    check('watchDate').isLength({ min: 10, max: 10 }).isISO8601({ strict: true }).optional({ checkFalsy: true }).not().isAfter()
],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const film = {
            title: req.body.title,
            favorite: req.body.favorite,
            watchDate: req.body.watchDate,
            rating: req.body.rating,
            user: req.user.id
        };

        filmDao.createFilm(film)
            .then(film => setTimeout(() => res.status(201).json(film), 2000))
            .catch((err) => res.status(500).json(err));
    });

// PUT /api/films/:id
app.put('/api/films/:id', isLoggedIn, [
    param('id').isInt(),
    check('title').isLength({ min: 1 }),
    check('favorite').isBoolean(),
    check('rating').isInt({ min: 0, max: 5 }),
    check('watchDate').isLength({ min: 10, max: 10 }).isISO8601({ strict: true }).optional({ checkFalsy: true }).not().isAfter()
],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const film = {
            id: req.params.id,
            title: req.body.title,
            favorite: req.body.favorite,
            watchDate: req.body.watchDate,
            rating: req.body.rating
        };

        filmDao.updateFilm(film, req.user.id)
            .then((film) => setTimeout(() => res.status(200).json(film), 2000))
            .catch((err) =>
                err.error == 'Film not found.' ?
                    res.status(404).json(err)
                    : res.status(500).json(err));
    });

// // PUT /api/films/:id/favorite
// app.put('/api/films/:id/favorite', [
//     param('id').isInt(),
//     body('favorite').isBoolean()
// ],
//     (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         filmDao.updateFavorite(req.params.id, req.body.favorite)
//             .then((film) => res.status(200).json(film))
//             .catch((err) =>
//                 err.error == 'Film not found.' ?
//                     res.status(404).json(err)
//                     : res.status(500).json(err));
//     });

// // PUT /api/films/:id/rating
// app.put('/api/films/:id/rating', [
//     param('id').isInt(),
//     body('rating').isInt({ min: 0, max: 5 })
// ],
//     (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         filmDao.updateRating(req.params.id, req.body.rating)
//             .then((film) => res.status(200).json(film))
//             .catch((err) =>
//                 err.error == 'Film not found.' ?
//                     res.status(404).json(err)
//                     : res.status(500).json(err));
//     });

// DELETE /api/films/:id
app.delete('/api/films/:id', [
    param('id').isInt()
],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        filmDao.deleteFilm(req.params.id, req.user.id)
            .then((film) => setTimeout(() => res.status(200).json(film), 2000))
            .catch((err) =>
                err.error == 'Film not found.' ?
                    res.status(404).json(err)
                    : res.status(500).json(err));
    });
/*** end APIs ***/

/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
          if (err)
            return next(err);
          
          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUser()
          return res.json(req.user);
        });
    })(req, res, next);
  });
  
  // ALTERNATIVE: if we are not interested in sending error messages...
  /*
  app.post('/api/sessions', passport.authenticate('local'), (req,res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.json(req.user);
  });
  */
  
  // DELETE /sessions/current 
  // logout
  app.delete('/api/sessions/current', (req, res) => {
    req.logout( ()=> { res.end(); } );
  });
  
  // GET /sessions/current
  // check whether the user is logged in or not
  app.get('/api/sessions/current', (req, res) => {  if(req.isAuthenticated()) {
      res.status(200).json(req.user);}
    else
      res.status(401).json({error: 'Unauthenticated user!'});;
  });

// Activate the server
app.listen(port, () => {
    console.log(`react-qa-server listening at http://localhost:${port}`);
});