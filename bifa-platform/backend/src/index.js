import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/hello", (req, res) => {
  res.json({ message: "Hello-World" });
});

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
