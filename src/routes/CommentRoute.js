const express = require('express');
const commentRoute = express.Router();

const  { 
    getComment,createComment,getCommentsByJoke
} = require('../controllers/CommentController')

commentRoute.get('/joke/:JokeID',getCommentsByJoke) // no parameters

commentRoute.get('/:CommentID', getComment); // no parameters

commentRoute.post('/:JokeID',createComment); // body = {author,commentText,commentMedia}



module.exports = commentRoute;