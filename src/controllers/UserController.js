const UserService = require("../database/user.service");

const getUsers = async (request, response) => {
    try {
        users = await UserService.getUsers();
        response.status(200).json({ users: users });
    }
    catch (error) {
        response.status(500).json({ msg: "Error: can't get users", error:error });
    }
};

const registerUser = async (request, response) => {
    try {
        const newUser = request.body;
        if(!newUser.username || !newUser.email || !newUser.password)  throw Error("missing data !");
        await UserService.registerUser(newUser.username,newUser.email,newUser.password,newUser.profilePic?newUser.profilePic:"",newUser.biography?newUser.biography:"");
        response.status(200).json();
    }
    catch (error) {
        response.status(500).json({ msg: "User not created", error:error });
    }
};

const getUser = async (request, response) => {
    const username = request.params.username;
    try {
        user = await UserService.getUser(username);
        response.status(200).json(user);
    }
    catch (error) {
        response.status(404).json({ msg: "User not found" });
    }
};

const updateUser = async (request, response) => {
    const username = request.params.username;
    const changes = request.body;
    try {
        user = await UserService.updateUser(username,changes);
        response.status(200).json({msg: "User updated successfully"});
    }
    catch (error) {
        response.status(400).json({ msg: "User not updated" });
    }
};

const deleteUser = async (request, response) => {
    const username = request.params.username;
    try {
        user = await UserService.deleteUser(username);
        response.status(200).json({msg: "User deleted successfully"});
    }
    catch (error) {
        response.status(404).json({ msg: "User not deleted" });
    }
};

module.exports = {getUser,getUsers,registerUser,updateUser,deleteUser}