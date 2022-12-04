const sqlite3 = require('better-sqlite3')
const path = require('path');
const md5 = require('md5')

const db = new sqlite3(path.resolve('joke_project.db'), {fileMustExist: false});

function migrate() {
    let password = md5('admin');
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return db.exec(`
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS jokes;
    DROP TABLE IF EXISTS users;
    CREATE TABLE IF NOT EXISTS users (
        "userID" INTEGER PRIMARY KEY AUTOINCREMENT,
        "username" VARCHAR(45) NOT NULL,
        "email" VARCHAR(60) NOT NULL,
        "passwordHash" VARCHAR(45) NOT NULL,
        "profilePic" VARCHAR(255) NULL,
        "biography" VARCHAR(255) NULL
        );

        INSERT INTO users (username,email,passwordHash,profilePic,biography) VALUES ('admin', 'admin@admin.com', '${password}', '', 'Hey ! Im an admin.' );

        CREATE TABLE IF NOT EXISTS jokes (
            "jokeID" INTEGER PRIMARY KEY AUTOINCREMENT,
            "authorID" INT NOT NULL,
            "title" VARCHAR(45) NOT NULL,
            "jokeText" VARCHAR(255) NULL,
            "jokeMedia" VARCHAR(255) NULL,
            "jokeDate" DATETIME NOT NULL,
            "jokeUpvotes" INT DEFAULT 1,
            CONSTRAINT Joke_User_FK FOREIGN KEY (authorID) REFERENCES users(userID)
            );
        
        INSERT INTO jokes (authorID,title,jokeText,jokeMedia,jokeDate) 
        VALUES ('1', 'Joke Title 1','Funny content 1','','${date}'),
        ('1', 'Joke Title 2','Funny content 2','','${date}'),
        ('1', 'Joke Title 3','Funny content 3','','${date}'),
        ('1', 'Joke Title 4','Funny content 4','','${date}'),
        ('1', 'Joke Title 5','Funny content 5','','${date}')
        ;
        
        CREATE TABLE IF NOT EXISTS comments (
                "commentID" INTEGER PRIMARY KEY AUTOINCREMENT,
                "commentText" VARCHAR(255) NULL,
                "commentMedia" VARCHAR(50) NULL,
                "commentDate" DATETIME NOT NULL,
                "commentUpvotes" INT NOT NULL DEFAULT 1,
                "commentAuthorID" INT NOT NULL,
                "jokeID" INT NOT NULL,
                "jokeAuthorID" INT NOT NULL,
                CONSTRAINT Comment_User_FK FOREIGN KEY (commentAuthorID) REFERENCES users(userID),
                CONSTRAINT Comment_Joke_FK FOREIGN KEY (jokeID) REFERENCES jokes(jokeID)
                );
        INSERT INTO comments (commentText,commentMedia,commentDate,commentAuthorID,jokeID,jokeAuthorID) 
        VALUES ('Cool comment 1 !', '','${date}','1','1','1'),
        ('Cool comment 2 !', '','${date}','1','1','1'),
        ('Cool comment 3 !', '','${date}','1','1','1'),
        ('Cool comment 4 !', '','${date}','1','2','1'),
        ('Cool comment 5 !', '','${date}','1','2','1')
        ;
    `);
}

function printState(){
    return new Promise(async (resolve, reject) => {
        try {
            let sql = await db.prepare('SELECT * FROM users,jokes,comments');
            resolve(await sql.all());

            resolve();
        } catch(e) {
            reject(e);
        }
    })
}

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
            let stmt = await db.prepare('SELECT username FROM users WHERE username = ? and passwordHash = ?');
            resolve(await stmt.get(username, md5(password)));
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
            res = {
                'user':user,
                'code':200
            }
            resolve(res);
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
            e.code = 400;
            reject(e);
        }
    });
}


module.exports = {migrate,printState,registerUser,getUser,updateUser,deleteUser,getUsers};