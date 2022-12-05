const {db} = require('./database');

function createComment(username, jokeID, commentText, commentMedia) {
    return new Promise(async (resolve, reject) => {
        try {
            if(!commentText&&!commentMedia) throw Error("Comment content can't be empty !");
            let user = getUser(username);
            let joke = getJoke(jokeID);
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            let register_sql = await db.prepare('INSERT INTO comments (commentText, commentMedia, commentDate, jokeID, commentAuthorID) VALUES ( ?, ?, ?, ?, ?)');
            await register_sql.run(commentText,commentMedia,date,jokeID,username);
            await upvoteJoke(jokeID);
            await updateUserUpvotes(user.userID);
            res = {
                'msg':'Comment added successfully !',
                'code':200
            }
        resolve(res);
        } catch(e) {
            e.code = 400;
            reject(e);
        }
    });
}

function getComment(id){
    return new Promise(async (resolve, reject) => {
        try {
            let get = await db.prepare('SELECT * FROM comments WHERE commentID = ?');
            comment = await get.get(id);
            if(!comment) throw Error("Comment not found !");
            res = {
                'comment':comment,
                'code':200
            }
            resolve(res);
        } catch(e) {
            e.code = 404;
            reject(e);
        }
    });
}

function updateComment(id,changes){
    return new Promise(async (resolve, reject) => {
        try {
            let comment = await getComment(id);
            let update = await db.prepare('UPDATE comments SET commentText=?, commentMedia=? WHERE commentID = ?');
            result = await update.run(
                changes.commentText?changes.commentText:joke.commentText,
                changes.commentMedia?changes.commentMedia:joke.commentMedia,
                id);
            res = {
                    'msg':'Comment updated successfully !',
                    'code':200
                }
            resolve(res);
        } catch(e) {
            e.code = 400;
            reject(e);
        }
    });
}

function upvoteComment(id,upvoteValue=1){
    return new Promise(async (resolve, reject) => {
        try {
            let comment = await getComment(id);
            let update = await db.prepare('UPDATE comments SET upvotes WHERE commentID = ?');
            result = await update.run(comment.upvotes+upvoteValue,id);
            await upvoteJoke(comment.jokeID,upvoteValue);
            res = {
                    'msg':'Comment upvoted successfully !',
                    'code':200
                }
            resolve(res);
        } catch(e) {
            e.code = 400;
            reject(e);
        }
    });
}

function deleteComment(id){
    return new Promise(async (resolve, reject) => {
        try {
            let comment = await getComment(id);
            let update = await db.prepare('DELETE FROM comments WHERE commentID = ?');
            result = await update.run(id);
            await upvoteJoke(comment.jokeID,-comment.upvotes);
            res = {
                    'msg':'Comment upvoted successfully !',
                    'code':200
                }
            resolve(res);
        } catch(e) {
            e.code = 400;
            reject(e);
        }
    });  
}

module.exports = {
    createComment,getComment,updateComment,upvoteComment,deleteComment
}