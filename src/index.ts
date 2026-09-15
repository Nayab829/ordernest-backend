import "dotenv/config";
import express from "express";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import productImageRoutes from "./routes/productImage.routes";
import reviewRoutes from "./routes/review.routes";
const app = express();
app.use(express.json());

app.use("/api", orderRoutes);
app.use("/api", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/product-images", productImageRoutes);
app.use("/api", reviewRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
