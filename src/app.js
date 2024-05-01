const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { registrationRoute } = require("./routes/registerRouter");
const { loginRoute } = require("./routes/loginRouter");
const { taskRouter } = require("./routes/taskRouter");
const { userRouter } = require("./routes/userRouter");

dotenv.config({ path: "../.env" });

app.get("/", (req, res) => {
  res.status(200).send("<em><strong>Welcome to task manager app<strong></em>");
});

app.use(express.json());
app.use("/register", registrationRoute);
app.use("/login", loginRoute);
app.use("/tasks", taskRouter);
app.use("/user", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
