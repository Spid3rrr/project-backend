const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");

const db = require("./src/database/database");

const userRoute = require("./src/routes/UserRoute");
const jokeRoute = require("./src/routes/JokeRoute");
const commentRoute = require("./src/routes/CommentRoute");

const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();

db.migrate();


app.listen(process.env.PORT, (err) => {
err
? console.log("server failed")
: console.log(`server is running on port ${process.env.PORT}`);
});

app.get('/', (req, res) => {
    console.log("received GET request");
    res.send('Successful response.');
  });


app.use("/users", userRoute);
app.use("/jokes", jokeRoute);
app.use("/comments", commentRoute);

module.exports = {app};