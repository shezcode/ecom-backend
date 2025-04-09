import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readJsonFile, writeJsonFile } from "../utils.js";

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data files path
const dataDir = join(__dirname, "..", "data");
const ordersFile = join(dataDir, "orders.json");

const router = express.Router();

// GET orders
router.get("/", async (req, res) => {
  try {
    const orders = await readJsonFile(ordersFile);

    // Filter by user if userId provided
    if (req.query.userId) {
      const userOrders = orders.filter(
        (order) => order.userId.toString() === req.query.userId
      );
      return res.json(userOrders);
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const orders = await readJsonFile(ordersFile);
    const order = orders.find((o) => o.id.toString() === req.params.id);

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order by id:", error);
    res.status(500).json({ error: "Failed to fetch order by id" });
  }
});

export default router;
