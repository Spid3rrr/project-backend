const {db} = require('./database');
const UserService = require("./user.service");

function createJoke(username, title, jokeText, jokeMedia) {
    return new Promise(async (resolve, reject) => {
        try {
            // if(!title) throw Error("Joke title can't be empty !");
            // if(!jokeText && !jokeMedia) throw Error("joke Content can't be empty !");
            let user = await UserService.getUser(username);
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            let register_sql = await db.prepare('INSERT INTO jokes (authorID, title, jokeText, jokeMedia, jokeDate) VALUES ( ?, ?, ?, ?, ?)');
            await register_sql.run(user.userID, title, jokeText, jokeMedia, date);
            res = {
                'message':'Joke added successfully !',
                'code':200
            }
            await UserService.updateUserUpvotes(username);
            resolve(res);
        } catch(e) {
            e.code = 400;
            reject(e);
        }
    });
}

function getJoke(id){
    return new Promise(async (resolve, reject) => {
        try {
            let get = await db.prepare('SELECT * FROM jokes WHERE jokeID = ?');
            joke = await get.get(id);
            if(!joke) throw Error("Joke not found !");
            resolve(joke);
        } catch(e) {
            e.code = 404;
            reject(e);
        }
    });
}

function updateJoke(id,changes){
    return new Promise(async (resolve, reject) => {
        try {
            let joke = await getJoke(id);
            let update = await db.prepare('UPDATE jokes SET title=?, jokeText=?, jokeMedia=? WHERE jokeID = ?');
            result = await update.run(
                changes.title?changes.title:joke.title,
                changes.jokeText?changes.jokeText:joke.jokeText,
                changes.jokeMedia?changes.jokeMedia:joke.jokeMedia,
                id);
            res = {
                    'message':'Joke updated successfully !',
                    'code':200
                }
            resolve(res);
        } catch(e) {
            e.code = 400;
            reject(e);
        }
    });
}

function deleteJoke(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let joke = await getJoke(id);
            console.log(joke);
            let del = await db.prepare('DELETE FROM jokes WHERE jokeID = ?');
            let res = await del.run(id);
            if(!res) throw Error("Joke was not deleted !");
            console.log(joke.authorID);
            let user = await UserService.getUserById(joke.authorID);
            console.log(user);
            await UserService.updateUserUpvotes(user.username,-joke.upvotes);
            res = {
                'message':'Joke deleted successfully !',
                'code':200
            }
            resolve(res);
        } catch(e) {
            e.code = 400;
            reject(e);
        }
    });
}

function upvoteJoke(id,upvoteValue=1){
    return new Promise(async (resolve, reject) => {
        try {
            let joke = await getJoke(id);
            let update = await db.prepare('UPDATE jokes SET upvotes=? WHERE jokeID = ?');
            result = await update.run(joke.upvotes+upvoteValue,id);
            let user = await UserService.getUserById(joke.authorID);
            await UserService.updateUserUpvotes(user.username,upvoteValue);
            res = {
                    'message':'Joke upvoted successfully !',
                    'code':200
                }
            resolve(res);
        } catch(e) {
            e.code = 400;
            reject(e);
        }
    });
}

function getJokesByUser(username){
    return new Promise(async (resolve, reject) => {
        try {
            let user = getUser(username);
            let get = await db.prepare('SELECT * FROM jokes WHERE authorID=?');
            jokes = await get.all(user.userID);
            if(!jokes) throw Error("couldn't get jokes from user !");
            resolve(jokes);
        } catch(e) {
            e.code = 404;
            reject(e);
        }
    });
}

function getJokes(){
    return new Promise(async (resolve, reject) => {
        try {
            let get = await db.prepare('SELECT * FROM jokes');
            jokes = await get.all();
            if(!jokes) throw Error("couldn't get jokes");
            resolve(jokes);
        } catch(e) {
            e.code = 404;
            reject(e);
        }
    });
}


function getTrending(){
    return new Promise(async (resolve, reject) => {
        try {
            let get = await db.prepare('SELECT * FROM jokes ORDER BY upvotes DESC');
            jokes = await get.all();
            if(!jokes) throw Error("couldn't get trending jokes");
            resolve(jokes);
        } catch(e) {
            e.code = 404;
            reject(e);
        }
    });
}

function getRecent(){
    return new Promise(async (resolve, reject) => {
        try {
            let get = await db.prepare('SELECT * FROM jokes ORDER BY jokeDate DESC');
            jokes = await get.all();
            if(!jokes) throw Error("couldn't get trending jokes");
            resolve(jokes);
        } catch(e) {
            e.code = 404;
            reject(e);
        }
    });
}


module.exports = {
    getJokes,createJoke,getJoke,updateJoke,upvoteJoke,deleteJoke,getTrending,getRecent,upvoteJoke
}