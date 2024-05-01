const taskRouter = require("express").Router();
const taskController = require("../controllers/taskController");
const { authenticateJWT } = require("../middleware/authJWT");
taskRouter.get("/", authenticateJWT, taskController.getAllTasks);
taskRouter.get("/filter", authenticateJWT, taskController.filterByTaskStatus);
taskRouter.get(
  "/search",
  authenticateJWT,
  taskController.searchTitleAndDesctiption
);
taskRouter.get("/:id", authenticateJWT, taskController.getTaskById);
taskRouter.post("/", authenticateJWT, taskController.createTask);
taskRouter.delete("/:id", authenticateJWT, taskController.deleteTaskById);
taskRouter.put("/:id", authenticateJWT, taskController.updateTask);
taskRouter.put(
  "/:taskId/assign/:userId",
  authenticateJWT,
  taskController.assignTask
);

module.exports = { taskRouter };
