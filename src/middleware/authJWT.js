const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../../config/dbconection");
dotenv.config({ path: "../../.env" });

const authenticateJWT = (req, res, next) => {
  if (req.headers?.authorization) {
    jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
      (err, data) => {
        if (err) {
          console.log(err);
          req.user = null;
          req.message = `Header verification failed - ${err}`;

          next();
        } else {
          db.query(
            "select * from user where userId = ?",
            [data.id],
            (error, result) => {
              if (error) {
                req.user = null;
                req.message = "Error while quering the user";
                next();
              } else {
                req.user = result[0];
                req.message = "User found successfully";
                next();
              }
            }
          );
        }
      }
    );
  } else {
    req.user = null;
    req.message = "Authorization not found!";
    next();
  }
};

module.exports = { authenticateJWT };
