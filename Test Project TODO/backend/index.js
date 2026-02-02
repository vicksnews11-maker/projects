const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

const mongoURL = process.env.MONGO_URL || "mongodb://mongo-service:27017/tododb";
mongoose.connect(mongoURL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const todoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean
});

const Todo = mongoose.model("Todo", todoSchema);

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.json(todo);
});

app.listen(3000, () => console.log("Backend running on port 3000"));
