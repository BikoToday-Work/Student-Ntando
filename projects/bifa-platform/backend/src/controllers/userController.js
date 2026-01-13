import prisma from "../prisma.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role },
      select: { id: true, email: true, role: true, createdAt: true }
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTestUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: hashedPassword,
        role: "ADMIN"
      },
      select: { id: true, email: true, role: true, createdAt: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};