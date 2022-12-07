const sqlite3 = require('better-sqlite3')
const path = require('path');
const md5 = require('md5');

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
        "username" VARCHAR(45) NOT NULL UNIQUE,
        "email" VARCHAR(60) NOT NULL,
        "passwordHash" VARCHAR(45) NOT NULL,
        "profilePic" VARCHAR(255) NULL,
        "biography" VARCHAR(255) NULL,
        "upvotes" INTEGER DEFAULT 1
        );

        INSERT INTO users (username,email,passwordHash,profilePic,biography) VALUES ('admin', 'admin@admin.com', '${password}', '', 'Hey ! Im an admin.' );

        CREATE TABLE IF NOT EXISTS jokes (
            "jokeID" INTEGER PRIMARY KEY AUTOINCREMENT,
            "authorID" INT NOT NULL,
            "title" VARCHAR(45) NOT NULL,
            "jokeText" VARCHAR(255) NULL,
            "jokeMedia" VARCHAR(255) NULL,
            "jokeDate" DATETIME NOT NULL,
            "upvotes" INT DEFAULT 1,
            CONSTRAINT Joke_User_FK FOREIGN KEY (authorID) REFERENCES users(userID) ON DELETE CASCADE
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
                "upvotes" INT NOT NULL DEFAULT 1,
                "commentAuthorID" INT NOT NULL,
                "jokeID" INT NOT NULL,
                CONSTRAINT Comment_User_FK FOREIGN KEY (commentAuthorID) REFERENCES users(userID) ON DELETE CASCADE,
                CONSTRAINT Comment_Joke_FK FOREIGN KEY (jokeID) REFERENCES jokes(jokeID) ON DELETE CASCADE
                );
        INSERT INTO comments (commentText,commentMedia,commentDate,commentAuthorID,jokeID) 
        VALUES ('Cool comment 1 !', '','${date}','1','1'),
        ('Cool comment 2 !', '','${date}','1','1'),
        ('Cool comment 3 !', '','${date}','1','1'),
        ('Cool comment 4 !', '','${date}','1','2'),
        ('Cool comment 5 !', '','${date}','1','2')
        ;
    `);
}



module.exports = {
    migrate,
    db
};