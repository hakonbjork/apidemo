require("dotenv").config();
let db = require("./config/database")
db.connect();
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const tasks = require("./services/task");
const app = express();

app.use(express.json());
const Book = require("./model/book");

// TODO
// 1 - an endpoint to create a book-instance
// 
/* Helper code 
  const { author, title } = req.body;
  // Validate user input
  if (!(author && title)) {
    return ??
  }

      // Create book in our database
      const book = await Book.create({
        author: author,
        title: title,

      });
  // return ??
});*/


// 2 - a resouce to get all book instances

// 3 - a resouce to get a book instance by id

// 4 - a way to update a book instace by id

// 5 - a way to delete book instace by id



app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.get('/tasks/:id', auth, (req, res) => {
  tasks.getTask(req.params.id, res)
})

app.get('/tasks', auth, (req, res) => {
  tasks.listTasks(res)
})

app.post('/tasks/:id', auth, (req, res) => {
  tasks.addTask(req.params.id, req, res)
})

app.post('/tasks/:id/response', auth, (req, res) => {
  tasks.checkResponse(req.params.id, req, res)
})

// importing user context
const User = require("./model/user");

// Register
app.post("/register", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ username });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      username,
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id },
      process.env.TOKEN_KEY,
      {
        expiresIn: "3h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

// Login
app.post("/login", async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

module.exports = app;