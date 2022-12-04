const db = require("../../database.js");

const getUsers = async (request, response) => {
    try {
        users = await db.getUsers();
        response.status(200).json({ users: users });
    }
    catch (error) {
        response.status(500).json({ msg: "Error: can't get users", error:error });
    }
};

const getUser = async (request, response) => {
    const username = request.params.username;
    try {
        user = await db.getUser(username);
    }
    catch (error) {
        response.status(404).json({ msg: "User not found" });
    }
};

module.exports = {getUser,getUsers}