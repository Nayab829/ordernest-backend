// src/server.ts
import express from "express";
import orderRoutes from "./routes/order.routes";
import authRoutes from "./routes/auth.routes";
const app = express();
app.use(express.json());

app.use("/api", orderRoutes);
app.use("/api", authRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
