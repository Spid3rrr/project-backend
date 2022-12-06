const express = require("express");

const jwt = require("../helpers/jwtHelper")

const userRoute = express.Router();


const {getUsers,getUser,registerUser,updateUser,deleteUser,loginUser} = require("../controllers/UserController");

userRoute.get("/", getUsers);

userRoute.post("/", registerUser);

userRoute.get("/:username",getUser);

userRoute.patch("/:username",updateUser);

userRoute.delete("/:username",deleteUser);

userRoute.post("/auth",loginUser);

module.exports = userRoute;