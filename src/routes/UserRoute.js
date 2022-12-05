const express = require("express");
const userRoute = express.Router();


const {getUsers,getUser,registerUser,updateUser,deleteUser} = require("../controllers/UserController");

userRoute.get("/", getUsers);

userRoute.post("/", registerUser);

userRoute.get("/:username", getUser);

userRoute.patch("/:username",updateUser);

userRoute.delete("/:username",deleteUser);


module.exports = userRoute;