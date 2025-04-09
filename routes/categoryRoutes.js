import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readJsonFile, writeJsonFile } from "../utils.js";

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data files path
const dataDir = join(__dirname, "..", "data");
const categoriesFile = join(dataDir, "categories.json");

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await readJsonFile(categoriesFile);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET category by ID
router.get("/:id", async (req, res) => {
  try {
    const categories = await readJsonFile(categoriesFile);
    const category = categories.find((c) => c.id.toString() === req.params.id);

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

export default router;
