import express from "express";
import { getUsers, createUser, createTestUser } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/users", authenticateToken, getUsers);
router.post("/users", authenticateToken, createUser);
router.post("/test-user", createTestUser);

export default router;