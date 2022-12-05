const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");

const db = require("./src/database/database");
const userRoute = require("./src/routes/UserRoute");

const app = express();

app.use(express.json());
app.use(cors({origin:'*'}));

dotenv.config();

db.migrate();


app.listen(process.env.PORT, (err) => {
err
? console.log("server failed")
: console.log(`server is running on port ${process.env.PORT}`);
});

app.get('/', (req, res) => {
    res.send('Successful response.');
  });


app.use("/users", userRoute);
