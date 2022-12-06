const UserService = require("../database/user.service");

const jwtHelper = require("../helpers/jwtHelper");

const getUsers = async (request, response) => {
    try {
        users = await UserService.getUsers();
        response.status(200).json({ users: users });
    }
    catch (error) {
        response.status(500).json({ message: "Can't get users"});
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
        response.status(500).json({ message: "User not created"});
    }
};

const getUser = async (request, response) => {
    const username = request.params.username;
    try {
        user = await UserService.getUser(username);
        response.status(200).json(user);
    }
    catch (error) {
        response.status(404).json({ message: "User not found" });
    }
};

const updateUser = async (request, response) => {
    const username = request.params.username;
    const changes = request.body;
    try {
        user = await UserService.updateUser(username,changes);
        response.status(200).json({message: "User updated successfully"});
    }
    catch (error) {
        response.status(400).json({ message: "User not updated" });
    }
};

const deleteUser = async (request, response) => {
    const username = request.params.username;
    try {
        user = await UserService.deleteUser(username);
        response.status(200).json({message: "User deleted successfully"});
    }
    catch (error) {
        response.status(404).json({ message: "User not deleted" });
    }
};

const loginUser = async(request,response) => {
    const creds = request.body;
    try {
        if(!creds.username||!creds.password) throw Error("Credentials not provided");
        let res = await UserService.loginUser(creds.username,creds.password);
        if(!res) throw Error("Username or Password incorrect!");
        let token = jwtHelper.generateToken(res.username);
        response.status(200).json({username:res.username,token:token});
    }
    catch (error){
        response.status(400).json({message:"Username or Password incorrect!"});
    }
};

module.exports = {getUser,getUsers,registerUser,updateUser,deleteUser,loginUser}