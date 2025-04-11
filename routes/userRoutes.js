import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readJsonFile, writeJsonFile } from "../utils.js";

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data files path
const dataDir = join(__dirname, "..", "data");
const usersFile = join(dataDir, "users.json");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await readJsonFile(usersFile);

    // If username and password provided, check auth
    if (req.query.username && req.query.password) {
      const matchedUsers = users.filter(
        (user) =>
          user.username === req.query.username &&
          user.password === req.query.password,
      );
      return res.json(matchedUsers);
    }
    const safeUsers = users.map(({ password, ...user }) => user); // Remove passwords
    res.json(safeUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const users = await readJsonFile(usersFile);
    const user = users.find((u) => u.id.toString() === req.params.id);

    if (user) {
      const { password, ...safeUser } = user; // Remove password
      res.json(safeUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// CREATE user

router.post("/", async (req, res) => {
  try {
    const users = await readJsonFile(usersFile);
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    await writeJsonFile(usersFile, users);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  try {
    const users = await readJsonFile(usersFile);
    const userIndex = users.findIndex((u) => u.id.toString() === req.params.id);

    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], ...req.body };
      users[userIndex] = updatedUser;
      await writeJsonFile(usersFile, users);
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});
// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const users = await readJsonFile(usersFile);
    const userIndex = users.findIndex((u) => u.id.toString() === req.params.id);

    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      await writeJsonFile(usersFile, users);
      res.status(204).end();
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});
// GET user by username
router.get("/username/:username", async (req, res) => {
  try {
    const users = await readJsonFile(usersFile);
    const user = users.find((u) => u.username === req.params.username);

    if (user) {
      const { password, ...safeUser } = user; // Remove password
      res.json(safeUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});
// GET user by email
router.get("/email/:email", async (req, res) => {
  try {
    const users = await readJsonFile(usersFile);
    const user = users.find((u) => u.email === req.params.email);

    if (user) {
      const { password, ...safeUser } = user; // Remove password
      res.json(safeUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
