const loginRoute = require("express").Router();

const login = require("../controllers/loginController");

loginRoute.post("/", login);

module.exports = { loginRoute };
