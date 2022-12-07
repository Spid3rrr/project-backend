const CommentService = require("../database/comment.service");


const getComment = async (request, response) => {
    const id = request.params.CommentID;
    try {
        comment = await CommentService.getComment(id);
        response.status(200).json(comment);
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Can't get comment"});
    }
};

const getCommentsByJoke = async (request, response) => {
    const JokeID = request.params.JokeID;
    try {
        comment = await CommentService.getCommentsByJoke(JokeID);
        response.status(200).json(comment);
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Can't get comments by joke"});
    }
};

const createComment = async (request, response) => {
    const JokeID = request.params.JokeID;
    const {author,commentText,commentMedia} = request.body;
    try {
        comment = await CommentService.createComment(author,JokeID,commentText,commentMedia);
        response.status(200).json({ message: "comment created", comment:request.body });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Can't create comment"});
    }
};


module.exports = {
    createComment,getComment,getCommentsByJoke
}