const express = require("express");
const { createUser, getAllUsers, login, updateUser, deleteUser } = require("../controllers/userController");
const router = express.Router();

// Route to register a new user
router.post("/register", createUser); // Creating new user

// Route to fetch all users
router.get("/users", getAllUsers); // Get all users

// Route to login
router.post("/login", login); // Handle login

// Route to update a user
router.put("/users/:id", updateUser); // Update user by ID

// Route to delete a user
router.delete("/users/:id", deleteUser); // Delete user by ID

module.exports = router;