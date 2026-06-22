import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// REGISTER A NEW USER
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 2. Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Save to database
    // Note: We use the default role "USER", unless we want to allow passing a role (dangerous in production!)
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      }
    });

    // 5. Omit the password before sending the response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userWithoutPassword
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// ==========================================
// LOGIN
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 1. Find user
    const user = await prisma.user.findUnique({ where: { email } });
    
    // We return a generic error to prevent email enumeration
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Create the JWT Payload (IMPORTANT: Include the role!)
    const payload = {
      userId: user.id,
      role: user.role
    };

    // 4. Sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '1d' // Token expires in 1 day
    });

    // 5. Send response
    // Only send non-sensitive user data
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during login" });
  }
});

export default router;
