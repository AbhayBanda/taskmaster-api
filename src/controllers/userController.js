const db = require("../../config/dbconection");
const bcrypt = require("bcrypt");
const getUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: req.message });
  }
  const userId = req.user.userId;

  db.query(
    "select userId, userName, userEmail from user where userId = ?",
    [userId],
    (error, result) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ error: `Unable to fetch data at this moment` });
      } else {
        return res.status(202).send(result);
      }
    }
  );
};

const updateUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: req.message });
  }
  const userId = req.user.userId;

  let updateTaskQuery = "UPDATE user SET";
  const columnsToUpdate = [];
  const valuesToUpdate = [];

  const { userName, userEmail, newPassword } = req.body;

  if (userName) {
    columnsToUpdate.push("userName = ?");
    valuesToUpdate.push(userName);
  }

  if (userEmail) {
    columnsToUpdate.push("userEmail = ?");
    valuesToUpdate.push(userEmail);
  }

  if (newPassword) {
    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    columnsToUpdate.push("userPassword = ?");
    valuesToUpdate.push(hashedPassword);
  }

  // query --> UPDATE table_name SET column1 = ?, column2 = ? , ... WHERE condition

  updateTaskQuery += " " + columnsToUpdate.join(", ") + " WHERE userId = ?";
  const queryParams = [...valuesToUpdate, userId];

  db.query(updateTaskQuery, queryParams, (error, result) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: `Unable to update user profile at this moment` });
    } else {
      return res.status(202).json({ meassage: "Profile Updated successfully" });
    }
  });
};

module.exports = { getUserProfile, updateUserProfile };
