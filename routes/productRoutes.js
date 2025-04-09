import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readJsonFile, writeJsonFile } from "../utils.js";

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data files path
const dataDir = join(__dirname, "..", "data");
const productsFile = join(dataDir, "products.json");

const router = express.Router();

// GET all products with search functionality
router.get("/", async (req, res) => {
  try {
    const products = await readJsonFile(productsFile);

    // Handle search query
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      const filteredProducts = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      );
      return res.json(filteredProducts);
    }

    // Return all products
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const products = await readJsonFile(productsFile);
    const product = products.find((p) => p.id.toString() === req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// GET products by category
router.get("/category/:categoryId", async (req, res) => {
  try {
    const products = await readJsonFile(productsFile);
    const categoryProducts = products.filter(
      (p) => p.categoryId.toString() === req.params.categoryId
    );

    res.json(categoryProducts);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Failed to fetch products by category" });
  }
});

// CREATE product
router.post("/", async (req, res) => {
  try {
    const products = await readJsonFile(productsFile);

    // Generate a new ID (in a real app, use UUID or similar)
    const newId = Math.max(...products.map((p) => parseInt(p.id))) + 1;

    const newProduct = {
      id: newId.toString(),
      ...req.body,
      createdAt: new Date().toISOString().split("T")[0],
    };

    products.push(newProduct);
    await writeJsonFile(productsFile, products);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// UPDATE product
router.put("/:id", async (req, res) => {
  try {
    const products = await readJsonFile(productsFile);
    const index = products.findIndex((p) => p.id.toString() === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = {
      ...products[index],
      ...req.body,
      id: products[index].id, // Ensure ID doesn't change
    };

    products[index] = updatedProduct;
    await writeJsonFile(productsFile, products);

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const products = await readJsonFile(productsFile);
    const filteredProducts = products.filter(
      (p) => p.id.toString() !== req.params.id
    );

    if (filteredProducts.length === products.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    await writeJsonFile(productsFile, filteredProducts);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
