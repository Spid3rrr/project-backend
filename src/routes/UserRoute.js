const express = require("express");

const jwt = require("../helpers/jwtHelper")

const userRoute = express.Router();


const {getUsers,getUser,registerUser,updateUser,deleteUser,loginUser} = require("../controllers/UserController");

userRoute.get("/", getUsers); // no parameters

userRoute.post("/", registerUser); // body = {"username","email","password"}

userRoute.get("/:username",getUser); // no parameters

userRoute.patch("/:username",updateUser); // body = {changes} expl : body = {"email":"newemail@mail.com"}

userRoute.delete("/:username",deleteUser); // no parameters

userRoute.post("/auth",loginUser); // body = {"username","password"}

module.exports = userRoute;