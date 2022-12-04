const express = require("express");
const userRoute = express.Router();


const {getUsers,getUser} = require("../controllers/UserController");

userRoute.get("/", getUsers);
userRoute.get("/:username", getUser);


module.exports = userRoute;