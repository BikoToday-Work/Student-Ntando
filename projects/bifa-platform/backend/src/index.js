import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import footballRoutes from "./routes/footballRoutes.js";
import refereeRoutes from "./routes/refereeRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import testRoutes from "./routes/testRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "BIFA Backend API", 
    status: "running",
    timestamp: new Date().toISOString()
  });
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello-World" });
});

// Core routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", testRoutes);

// Feature routes
app.use("/api/football", footballRoutes);
app.use("/api", refereeRoutes);
app.use("/api", competitionRoutes);
app.use("/api/matches", matchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}`);
  console.log(`⚽ Football API: http://localhost:${PORT}/api/football/leagues`);
});
