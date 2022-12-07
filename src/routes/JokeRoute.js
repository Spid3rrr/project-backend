const express = require('express');
const jokeRoute = express.Router();

const  { 
    getJokes,
    getJoke,
    createJoke,
    updateJoke,
    deleteJoke,
    getTrending,
    getRecent,
    upvoteJoke
} = require('../controllers/JokeController')

jokeRoute.get('/', getJokes); // no parameters

jokeRoute.get('/trending', getTrending); // no parameters
jokeRoute.get('/recent', getRecent); // no parameters

jokeRoute.get('/:JokeID', getJoke); // no parameters
jokeRoute.post('/', createJoke) ; // body = {"title","jokeText","jokeMedia","author"}
jokeRoute.patch('/:JokeID', updateJoke); // body = {changes} expl : body = {"title":"new title"}
jokeRoute.delete('/:JokeID', deleteJoke); // no parameters

jokeRoute.get('/:JokeID/upvote',upvoteJoke); // no parameters



module.exports = jokeRoute;