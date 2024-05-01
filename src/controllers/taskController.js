const db = require("../../config/dbconection");

const getAllTasks = (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: req.message });
  }

  db.query("select * from tasks", (error, result) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: `Unable to fetch data at this moment` });
    } else {
      console.log(result[0]);
      return res.status(200).send(result);
    }
  });
};

const getTaskById = (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: req.message });
  }

  const taskId = req.params.id;
  db.query(
    "select * from tasks where taskId = ?",
    [taskId],
    (error, result) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ error: `Unable to fetch data at this moment` });
      } else {
        console.log(result);
        if (result.length === 0) {
          return res
            .status(404)
            .json({ message: `No user found with Id - ${taskId}` });
        } else {
          return res.status(202).send(result);
        }
      }
    }
  );
};

const createTask = (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: req.message });
  }
  const task = req.body;
  const taskTitle = task.Title;
  const taskDescription = task.TaskDescription;
  const dueDate = task.dueDate;
  const userId = task.userId || null;

  db.query(
    "insert into tasks (Title, TaskDescription, dueDate, userId) values (?, ?, STR_TO_DATE(?, '%d-%m-%Y'), ?)",
    [taskTitle, taskDescription, dueDate, userId],
    (error, result) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ error: `Unable to perform this action at this moment` });
      } else {
        console.log(result);
        return res.status(202).json({
          message: "Task created successfully!",
          taskId: result.insertId,
        });
      }
    }
  );
};

const deleteTaskById = (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: req.message });
  }
  const taskId = req.params.id;
  db.query("delete from tasks where taskId = ?", [taskId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: `error in deleting the taskId ${taskId} `,
        error: error,
      });
    } else {
      console.log(result);
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: `oops! taskId=${taskId} not found` });
      }
      return res.status(201).json({ message: "Task successfully deleted" });
    }
  });
};

const updateTask = (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: req.message });
  }
  const taskId = req.params.id;

  let updateTaskQuery = "UPDATE tasks SET";
  const columnsToUpdate = [];
  const valuesToUpdate = [];

  const { Title, TaskDescription, userId, dueDate, taskStatus } = req.body;

  if (Title) {
    columnsToUpdate.push("Title = ?");
    valuesToUpdate.push(Title);
  }

  if (TaskDescription) {
    columnsToUpdate.push("TaskDescription = ?");
    valuesToUpdate.push(TaskDescription);
  }

  if (userId) {
    columnsToUpdate.push("userId = ?");
    valuesToUpdate.push(userId);
  }

  if (dueDate) {
    columnsToUpdate.push("dueDate = STR_TO_DATE(?, '%d-%m-%Y')");
    valuesToUpdate.push(dueDate);
  }

  if (taskStatus) {
    columnsToUpdate.push("taskStatus = ?");
    valuesToUpdate.push(taskStatus);
  }

  // query --> UPDATE table_name SET column1 = ?, column2 = ? , ... WHERE condition

  updateTaskQuery += " " + columnsToUpdate.join(", ") + " WHERE taskId = ?";
  const queryParams = [...valuesToUpdate, taskId];

  db.query(updateTaskQuery, queryParams, (error, result) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: `Unable to edit task at this moment` });
    } else {
      return res.status(202).json({ meassage: "Task Updated successfully" });
    }
  });
};

const getTasksAssignedToUser = (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: req.message });
  }

  const userId = req.user.id;
  db.query(
    "select * from tasks where userId = ?",
    [userId],
    (error, result) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ error: `Unable to edit task at this moment` });
      } else {
        return res.status(202).send(result);
      }
    }
  );
};

const assignTask = (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: req.message });
  }
  const taskId = req.params.taskId;
  const userId = req.params.userId;

  db.query(
    "UPDATE tasks SET userId = ? WHERE taskId = ?",
    [userId, taskId],
    async (error, result) => {
      if (!req.user) {
        return res.status(403).json({ message: req.message });
      }

      try {
        const validUserId = await isUserIdValid(userId);
        const validTaskId = await isTaskIdValid(taskId);
        return res
          .status(202)
          .json({ message: `Task Assigned to userId ${userId}` });
      } catch (exception) {
        return res.status(500).json({ errorMessage: exception });
      }
    }
  );
};

const filterByTaskStatus = (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: req.message });
  }
  console.log(req.query);
  const status = req.query.status;
  db.query(
    "select * from tasks where taskStatus = ?",
    [status],
    (error, result) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ error: `Unable to edit task at this moment` });
      } else {
        return res.status(200).send(result);
      }
    }
  );
};

const searchTitleAndDesctiption = (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: req.message });
  }
  const { title, description } = req.query;
  const sanitizedTitle = title ? title.replace(/"/g, "") : "";
  const sanitizedDescription = description ? description.replace(/"/g, "") : "";

  columnsToUpdate = [];
  queryParams = [];
  if (title) {
    columnsToUpdate.push(" LOWER(Title) LIKE ?");
    queryParams.push("%" + sanitizedTitle + "%");
  }

  if (description) {
    columnsToUpdate.push("LOWER(taskDescription) LIKE ?");
    queryParams.push("%" + sanitizedDescription + "%");
  }
  console.log(`[title] - ${title} , [description] - ${description}`);
  const sqlQuery =
    "SELECT taskId, Title, taskDescription, userId, dueDate, taskStatus FROM tasks WHERE " +
    columnsToUpdate.join(" OR ");
  console.log(
    "Executing SQL query:",
    sqlQuery,
    "with parameters:",
    queryParams
  );

  db.query(sqlQuery, queryParams, (error, result) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: `Unable to edit task at this moment` });
    } else {
      console.log(result);
      if (result.length === 0)
        return res.status(200).json({ message: "No tasks found!" });
      return res.status(200).send(result);
    }
  });
};

const isUserIdValid = async (userId) => {
  db.query("select * from user where userId = ?", [userId], (error, result) => {
    if (error) {
      return Promise.reject("Unable to query DB");
    } else {
      return Promise.resolve(result);
    }
  });
};

const isTaskIdValid = async (taskId) => {
  db.query(
    "select * from tasks where taskId = ?",
    [taskId],
    (error, result) => {
      if (error) {
        return Promise.reject("Unable to query DB");
      } else {
        return Promise.resolve(result);
      }
    }
  );
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTaskById,
  updateTask,
  getTasksAssignedToUser,
  assignTask,
  filterByTaskStatus,
  searchTitleAndDesctiption,
};
