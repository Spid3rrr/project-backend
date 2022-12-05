const md5 = require('md5');
const {db} = require('./database');

function registerUser(username, email, password, profilePic, biography) {
    return new Promise(async (resolve, reject) => {
        try {
            let register_sql = await db.prepare('INSERT INTO users (username, email, passwordHash, profilePic, biography) VALUES ( ?, ?, ?, ?, ?)');
            await register_sql.run(username, email, md5(password), profilePic, biography);
            res = {
                'msg':'User registered successfully !',
                'code':200
            }
        resolve(res);
        } catch(e) {
            e.code = 400;
            reject(e);
        }
    });
}

function loginUser(username, password) {
    return new Promise(async (resolve, reject) => {
        try {
            let login = await db.prepare('SELECT username FROM users WHERE username = ? and passwordHash = ?');
            resolve(await login.get(username, md5(password)));
        } catch(e) {
            reject(e);
        }
    });
}

function getUsers() {
    return new Promise(async (resolve, reject) => {
        try {
            let get = await db.prepare('SELECT * FROM users');
            users = await get.all();
            if(!users) throw Error("couldn't get users !");
            resolve(users);
        } catch(e) {
            e.code = 404;
            reject(e);
        }
    });
}

function getUser(username) {
    return new Promise(async (resolve, reject) => {
        try {
            let get = await db.prepare('SELECT * FROM users WHERE username = ?');
            user = await get.get(username);
            if(!user) throw Error("User not found !");
            resolve(user);
        } catch(e) {
            e.code = 404;
            reject(e);
        }
    });
}

function updateUser(username,changes){
    return new Promise(async (resolve, reject) => {
        try {
            let user = await getUser(username);
            let update = await db.prepare('UPDATE users SET email=?,passwordHash=?,profilePic=?,biography=? WHERE username = ?');
            result = await update.run(
                changes.email?changes.email:user.email,
                changes.password?md5(changes.password):user.passwordHash,
                changes.profilePic?changes.profilePic:user.profilePic,
                changes.biography?changes.biography:user.biography,
                username);
            res = {
                    'msg':'User updated successfully !',
                    'code':200
                }
            resolve(res);
        } catch(e) {
            console.log(e);
            e.code = 400;
            reject(e);
        }
    });
}

function deleteUser(username) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await getUser(username);
            let del = await db.prepare('DELETE FROM users WHERE username = ?');
            let res = await del.run(username);
            if(!res) throw Error("User was not deleted !");
            res = {
                'msg':'User deleted successfully !',
                'code':200
            }
            resolve(res);
        } catch(e) {
            console.log(e);
            e.code = 400;
            reject(e);
        }
    });
}

function updateUserUpvotes(username,upvoteValue=1){
    return new Promise(async (resolve, reject) => {
        try {
            let user = await getUser(username);
            let upvotes = user.upvotes;
            upvotes += upvoteValue;
            let update = await db.prepare('UPDATE users SET upvotes=? WHERE username = ?');
            let res = await update.run(username,upvotes);
            if(!res) throw Error("User was not upvoted !");
            res = {
                'msg':'User upvoted successfully !',
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
    registerUser,getUser,updateUser,deleteUser,getUsers,updateUserUpvotes
};