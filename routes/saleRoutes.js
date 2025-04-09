import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readJsonFile, writeJsonFile } from "../utils.js";

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data files path
const dataDir = join(__dirname, "..", "data");
const salesFile = join(dataDir, "salesFile.json");

const router = express.Router();

// GET sales data
router.get("/", async (req, res) => {
  try {
    const sales = await readJsonFile(salesFile);
    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Failed to fetch sales data" });
  }
});

export default router;
