import express from "express";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ====== PRODUCTS ROUTES ======
app.use("/api/products", productRoutes);

// ====== CATEGORIES ROUTES ======

app.use("/api/categories", categoryRoutes);

// ====== USERS ROUTES ======

app.use("/api/users", userRoutes);

// ====== SALES ROUTES ======

app.use("/api/sales", saleRoutes);

// ====== ORDERS ROUTES ======

app.use("/api/orders", orderRoutes);

// ====== SERVER STARTUP ======

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
