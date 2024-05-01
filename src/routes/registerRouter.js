const registrationRoute = require("express").Router();

const register = require("../controllers/registerController");

registrationRoute.post("/", register);

module.exports = { registrationRoute };
