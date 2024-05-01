const bcrypt = require("bcrypt");
const db = require("../../config/dbconection");

const register = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  db.query(
    "insert into user (username, userpassword, useremail) values (?, ?, ?)",
    [username, hashedPassword, email],
    (err, result) => {
      if (err) {
        console.log(err.sqlMessage);
        return res
          .status(500)
          .send(`Error in registering the user - ${err.sqlMessage}`);
      }
      res.status(201).send("User registration successfull");
    }
  );
};

module.exports = register;
