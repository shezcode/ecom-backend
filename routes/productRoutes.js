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

// GET all products with enhanced search functionality
router.get("/", async (req, res) => {
  try {
    const products = await readJsonFile(productsFile);

    // Handle search queries
    if (Object.keys(req.query).length > 0) {
      let filteredProducts = [...products];

      // Search by name
      if (req.query.name) {
        const nameSearch = req.query.name.toLowerCase();
        filteredProducts = filteredProducts.filter((product) =>
          product.name.toLowerCase().includes(nameSearch),
        );
      }

      // Search by description
      if (req.query.description) {
        const descSearch = req.query.description.toLowerCase();
        filteredProducts = filteredProducts.filter((product) =>
          product.description.toLowerCase().includes(descSearch),
        );
      }

      // General search (searches both name and description)
      if (req.query.search) {
        const generalSearch = req.query.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(generalSearch) ||
            product.description.toLowerCase().includes(generalSearch),
        );
      }

      // Filter by category
      if (req.query.categoryId) {
        filteredProducts = filteredProducts.filter(
          (product) => product.categoryId.toString() === req.query.categoryId,
        );
      }

      // Filter by price range
      if (req.query.minPrice) {
        const minPrice = parseFloat(req.query.minPrice);
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= minPrice,
        );
      }

      if (req.query.maxPrice) {
        const maxPrice = parseFloat(req.query.maxPrice);
        filteredProducts = filteredProducts.filter(
          (product) => product.price <= maxPrice,
        );
      }

      return res.json(filteredProducts);
    }

    // Return all products if no search params
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Add a dedicated search endpoint for more complex searches
router.get("/search", async (req, res) => {
  try {
    const products = await readJsonFile(productsFile);

    // Get search parameters
    const { query, fields = "name,description", exact = "false" } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Parse fields to search in
    const searchFields = fields.split(",");
    const isExactMatch = exact.toLowerCase() === "true";
    const searchTerm = query.toLowerCase();

    // Perform search
    const results = products.filter((product) => {
      // For each field specified
      return searchFields.some((field) => {
        if (!product[field]) return false;

        const fieldValue = product[field].toLowerCase();

        // Exact match or contains
        if (isExactMatch) {
          return fieldValue === searchTerm;
        } else {
          return fieldValue.includes(searchTerm);
        }
      });
    });

    res.json(results);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Failed to search products" });
  }
});

// Other routes remain the same...

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

// Make sure this route is defined before the /:id route to avoid conflicts
router.get("/category/:categoryId", async (req, res) => {
  try {
    const products = await readJsonFile(productsFile);
    const categoryProducts = products.filter(
      (p) => p.categoryId.toString() === req.params.categoryId,
    );

    res.json(categoryProducts);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Failed to fetch products by category" });
  }
});

export default router;
