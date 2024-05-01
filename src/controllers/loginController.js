const db = require("../../config/dbconection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });

const login = async (req, res) => {
  const { username, password } = req.body;

  // fetch username from db
  const fetch_username = "select * from ?? where username = ?";

  db.query(fetch_username, ["user", username], (err, users, fields) => {
    if (err) {
      return res
        .status(404)
        .json({ message: "Error in verifying the username", error: err });
    }
    // Validate user password
    if (users.length === 0) {
      return res.status(404).json({ error: "Username not found" });
    }
    let isPasswordValid = bcrypt.compareSync(password, users[0].userpassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Generate and send access token to user
    const accessToken = jwt.sign(
      { id: users[0].userId },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }
    );
    res.status(200).json({
      message: "Login Successfull",
      accessToken: accessToken,
    });
  });
};

module.exports = login;
