const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg"); // PostgreSQL client
const bcrypt = require("bcrypt"); // Used for hashing passwords
const jwt = require("jsonwebtoken"); // Used for handling JWT
const { body, validationResult } = require("express-validator"); // Validates and sanitizes input
const csrf = require("csurf"); // Middleware for CSRF token management
const helmet = require("helmet"); // Helps secure Express apps by setting various HTTP headers
const cookieParser = require("cookie-parser"); // Parse Cookie header and populate req.cookies
require("dotenv").config(); // Loads environment variables from a .env file into process.env

// Set up PostgreSQL connection using Pool for efficient client management
const pool = new Pool({
  user: "root",
  host: "localhost",
  database: "taskmanager",
  password: process.env.DB_PASSWORD, // Securely load the password from an environment variable
  port: 5432,
});

const app = express();
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format
app.use(helmet()); // Apply Helmet middleware for security headers

// CSRF protection middleware setup using cookies
const csrfProtection = csrf({ cookie: true });
app.use(cookieParser()); // Enable cookie parsing for CSRF token management

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User Registration Endpoint
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hashedPassword,
    ]);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// User Login Endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = rows[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { username: user.username, user_id: user.user_id }, // Include user_id in the token payload
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ user_id: user.user_id, token });
    } else {
      res.status(401).send("Invalid username or password");
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to provide the CSRF token to the client
app.get("/get-csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Route to retrieve all tasks
app.get("/tasks", authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT tasks.*, users.username FROM tasks JOIN users ON tasks.user_id = users.user_id"
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to add a new task with input validation and CSRF protection
app.post(
  "/tasks",
  body("title").isString().trim().escape(),
  body("status").isBoolean(),
  body("user_id").isInt(), // Validate user_id
  authenticateToken, // Ensure the user is authenticated
  csrfProtection,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, status, user_id } = req.body;
      const { rows } = await pool.query(
        "INSERT INTO tasks (title, status, user_id) VALUES ($1, $2, $3) RETURNING *",
        [title, status, user_id]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Route to update a task, also with validation and CSRF protection
app.put(
  "/tasks/:id",
  body("title").isString().trim().escape(),
  body("status").isBoolean(),
  csrfProtection,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { title, status } = req.body;
      const { rows } = await pool.query(
        "UPDATE tasks SET title = $1, status = $2 WHERE id = $3 RETURNING *",
        [title, status, id]
      );
      res.status(200).json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Route to delete a task with CSRF protection
app.delete("/tasks/:id", csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Error handling middleware for CSRF token issues
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    res.status(403).json({ error: "Invalid CSRF token" });
  } else {
    next(err);
  }
});

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
