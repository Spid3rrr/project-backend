const JokeService = require("../database/joke.service");


const getJokes = async (request, response) => {
    try {
        jokes = await JokeService.getJokes();
        response.status(200).json({ jokes: jokes });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Can't get jokes"});
    }
};

const getRecent = async (request, response) => {
    try {
        jokes = await JokeService.getRecent();
        response.status(200).json({jokes:jokes});
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Can't get jokes"});
    }
};

const getTrending = async (request, response) => {
    try {
        jokes = await JokeService.getTrending();
        response.status(200).json({jokes:jokes});
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Can't get jokes"});
    }
};

const upvoteJoke = async (request, response) => {
    const jokeid = request.params.JokeID;
    try {
        jokes = await JokeService.upvoteJoke(jokeid);
        response.status(200).json({jokes:jokes});
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Can't get jokes"});
    }
};

const createJoke = async (request, response) => {
    try {
        const newJoke = request.body;
        await JokeService.createJoke(newJoke.author,newJoke.title,newJoke.jokeText,newJoke.jokeMedia);
        response.status(200).json({message : "Joke created", joke:newJoke});
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Joke not created"});
    }
};

const getJoke = async (request, response) => {
    const jokeid = request.params.JokeID;
    try {
        joke = await JokeService.getJoke(jokeid);
        response.status(200).json(joke);
        if(!jokes) throw Error("couldn't get joke !");
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ message: "Can't get jokes"});
    }
};

const updateJoke = async (request, response) => {
    const jokeid = request.params.JokeID;
    const changes = request.body;
    try {
        joke = await JokeService.updateJoke(jokeid,changes);
        response.status(200).json({message: "Joke updated successfully"});
    }
    catch (error) {
        console.log(error);
        response.status(400).json({ message: "Joke not updated" });
    }
};
const deleteJoke = async (request, response) => {
    const jokeid = request.params.JokeID;
    try {
        joke = await JokeService.deleteJoke(jokeid);
        response.status(200).json({message: "Joke deleted successfully"});
    }
    catch (error) {
        console.log(error);
        response.status(404).json({ message: "Joke not deleted" });
    }
};

module.exports = {
    getJokes,
    getJoke,
    createJoke,
    updateJoke,
    deleteJoke,
    getTrending,
    getRecent,
    upvoteJoke
}