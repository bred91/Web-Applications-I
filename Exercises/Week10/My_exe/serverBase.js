'use strict';

const express = require('express');
const morgan = require('morgan');                               // logging middleware
const dao = require('./dao');                                   // module for accessing the DB

const app = express();

// middleware
app.use(morgan('dev'));
app.use(express.json());

// // '/' is the default request of the browser
// app.get('/', (req, res) => {
//     res.send('Ciao!');
// });

// GET /api/questions
app.get('/api/questions', (req, res) => {
    dao.listQuestions()
        .then(questions => res.json(questions))                 // promise fullfilled
        .catch(() => res.status(500).end);                      // promise rejected
});

// GET /api/questions/<id>
app.get('/api/questions/:id', async (req, res) => {
    try {
        const question = await dao.getQuestion(req.params.id);
        if (question.error)
            res.status(404).json(question);
        else
            res.json(question);
    } catch (err) {
        res.status(500).end();
    }
});

app.get('/api/questions/:id/answers', async (req, res) => {
    try {
        const resultQuestion = await dao.getQuestion(req.params.id);    

        if (resultQuestion.error)
            res.status(404).json(resultQuestion);
        else {
            const result = await dao.listAnswersByQuestion(req.params.id);

            if (result.error)
                res.status(404).json(result);
            else
                res.json(result); // NB: result could be an empty array
        }
    } catch (err) {
        res.status(500).end();
    }
});

// POST /api/answers
// app.post('/api/answers/:id', [
//     check('score').isInt()
// ]


// posrt 3001 , callback function
const port = 3001;
app.listen(port, () => console.log(`Server listening on port at http://localhost:${port} `));