'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult, param, body } = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB
const cors = require('cors'); // enable CORS
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the user info in the DB
const path = require('path');

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
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));

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
// GET /api/pages
app.get('/api/pages', (req, res) => {
  dao.getPages()
    // .then((pages) => setTimeout(() => res.json(pages), 2000))
    .then((pages) => res.json(pages))
    .catch((error) => res.status(500).json(error));
});

// POST /api/pages
app.post('/api/pages', isLoggedIn, [
  check('title').isLength({ min: 1 }),
  check('authorId').isInt({ min: 1 }),
  check('creationDate').isLength({ min: 10, max: 10 }).isISO8601({ strict: true }),
  check('publicationDate').isLength({ min: 10, max: 10 }).isISO8601({ strict: true }).optional({ nullable: true }),
  check('blocks').isArray({ min: 2 }),
  check('blocks.*.type').isInt({ min: 1, max: 3 }),
  check('blocks.*.content').isLength({ min: 1 }),
  check('blocks.*.order').isInt({ min: 0 })
],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const blocks = req.body.blocks;
    // check the types of the blocks
    if (!(blocks.map((block) => block.type).includes(1) &&
      (blocks.map((block) => block.type).includes(2)
        || blocks.map((block) => block.type).includes(3))))
      return res.status(422).json({ errors: 'You need to have at least one header and one paragraph or image' });

    // if it is not the admin, the authorId must be the same as the user id
    if (req.user.isAdmin !== 1 && req.user.id !== req.body.authorId) {
      return res.status(422).json({ errors: 'Unauthorized request: the Author can not be different from who create the Page!' });
    }

    const page = {
      title: req.body.title,
      authorId: req.user.isAdmin === 1 ? req.body.authorId : req.user.id,
      creationDate: req.body.creationDate,
      publicationDate: req.body.publicationDate,
      blocks: blocks
    };
    
    dao.createPage(page)
      .then((page) => res.status(201).json(page))
      .catch((err) =>
        String(err).startsWith('Validation Error:') ?
          res.status(422).json(err)
          : res.status(500).json(err));
  });

// POST /api/pages/:id
app.post('/api/pages/:id', isLoggedIn, [
  check('title').isLength({ min: 1 }),
  check('authorId').isInt({ min: 1 }),
  check('creationDate').isLength({ min: 10, max: 10 }).isISO8601({ strict: true }),
  check('publicationDate').isLength({ min: 10, max: 10 }).isISO8601({ strict: true }).optional({ nullable: true }),
  check('blocks').isArray({ min: 2 }),
  check('blocks.*.type').isInt({ min: 1, max: 3 }),
  check('blocks.*.content').isLength({ min: 1 })
],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const blocks = req.body.blocks;
    // check the types of the blocks
    if (!(blocks.filter(b => b.operation != 'delete').map((block) => block.type).includes(1) &&
      (blocks.filter(b => b.operation != 'delete').map((block) => block.type).includes(2)
        || blocks.filter(b => b.operation != 'delete').map((block) => block.type).includes(3))))
      return res.status(422).json({ errors: 'You need to have at least one header and one paragraph or image' });

    // if it is not the admin, the authorId must be the same as the user id
    if (req.user.isAdmin !== 1 && req.user.id !== req.body.authorId) {
      return res.status(422).json({ errors: 'Unauthorized request: the Author can not be different from who create the Page!' });
    }

    // check if the author of the page is the same as the user who is updating it (or if it is the admin)
    dao.getPageById(req.params.id)
      .then((page) => {
        if (req.user.isAdmin !== 1 && req.user.id !== page.authorId) {
          return res.status(422).json({ errors: 'Unauthorized request: the Author can not be different from who create the Page!' });
        }

        const updatedPage = {
          id: req.params.id,
          title: req.body.title,
          authorId: req.user.isAdmin === 1 ? req.body.authorId : req.user.id,
          creationDate: req.body.creationDate,
          publicationDate: req.body.publicationDate,
          blocks: blocks
        };

        dao.updatePage(updatedPage)
          .then((p) => res.status(200).json(p))
          .catch((err) =>
            String(err).startsWith('Validation Error:') ?
              res.status(422).json(err)
              : res.status(500).json(err));

      })
      .catch((err) => res.status(500).json(err));


  });


// DELETE /api/pages/:id
app.delete('/api/pages/:id', isLoggedIn, (req, res) => {
  dao.getPageById(req.params.id)
    .then((page) => {
      if (req.user.isAdmin !== 1 && req.user.id !== page.authorId) {
        return res.status(422).json({ errors: 'Unauthorized request: the requester can not be different from who create the Page!' });
      }

      dao.deletePage(req.params.id)
        .then(() => res.status(200).end())
        .catch((error) => res.status(500).json(error));
    })
    .catch((err) => res.status(500).json(err));
});

// GET /api/content
app.get('/api/content', (req, res) => {
  dao.getContent()
    //.then((content) => setTimeout(() => res.json(content), 2000))
    .then((content) => res.json(content))
    .catch((error) => res.status(500).json(error));
});

// GET /api/users
app.get('/api/users', isLoggedIn, (req, res) => {
  if (req.user.isAdmin !== 1) {
    return res.status(422).json({ errors: 'Unauthorized request: only the Admin can see the users!' });
  }

  dao.getUsers()
    //.then((users) => setTimeout(() => res.json(users), 2000))
    .then((users) => res.json(users))
    .catch((error) => res.status(500).json(error));
});

// GET /api/siteName
app.get('/api/siteName', (req, res) => {
  dao.getSiteName()
    //.then((siteName) => setTimeout(() => res.json(siteName), 2000))
    .then((siteName) => res.json(siteName))
    .catch((error) => res.status(500).json(error));
});

// PUT /api/siteName
app.put('/api/siteName', isLoggedIn, [
  check('siteName').isLength({ min: 1 })
],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // check if the user is admin
    if (req.user.isAdmin !== 1) {
      return res.status(401).json({ error: 'Unauthorized user!' });
    }

    const siteName = req.body.siteName;

    dao.changeSiteName(siteName)
      .then((siteName) => res.json(siteName))
      .catch((error) => res.status(500).json(error));
  });
/*** End APIs ***/




/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
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

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => { res.end(); });
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});

// Activate the server
app.listen(port, () => {
  console.log(`react-qa-server listening at http://localhost:${port}`);
});
/*** End Users APIs ***/