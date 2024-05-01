const userRouter = require("express").Router();
const userController = require("../controllers/userController");
const taskController = require("../controllers/taskController");
const { authenticateJWT } = require("../middleware/authJWT");
userRouter.get("/profile", authenticateJWT, userController.getUserProfile);
userRouter.put(
  "/editProfile",
  authenticateJWT,
  userController.updateUserProfile
);
userRouter.get(
  "/myTasks",
  authenticateJWT,
  taskController.getTasksAssignedToUser
);
module.exports = { userRouter };
