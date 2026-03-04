import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config({ path: '../frontend/.env' });

const app = express();
app.use(cors());
app.use(express.json());

let db;

// MongoDB Connection
MongoClient.connect(process.env.MONGODB_URI)
  .then(client => {
    db = client.db('OrthoVita');
    console.log('✅ MongoDB connected');
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: db ? 'connected' : 'disconnected' });
});

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res.status(400).json({ error: 'Name, email required. Password min 6 characters.' });
    }

    const existing = await db.collection('users').findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please sign in to continue.'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await db.collection('users').findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'No account found with this email. Please sign up first.' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: { id: user._id.toString(), name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Session Routes
app.post('/api/sessions', authMiddleware, async (req, res) => {
  try {
    const { exercise, reps, avg_accuracy, avg_angle, bad_posture_percent, duration } = req.body;

    const result = await db.collection('sessions').insertOne({
      userId: new ObjectId(req.userId),
      exercise,
      reps,
      avg_accuracy,
      avg_angle,
      bad_posture_percent,
      duration,
      createdAt: new Date()
    });

    res.status(201).json({ success: true, id: result.insertedId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.get('/api/sessions', authMiddleware, async (req, res) => {
  try {
    const sessions = await db.collection('sessions')
      .find({ userId: new ObjectId(req.userId) })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

// Profile Routes
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await db.collection('profiles').findOne({ userId: new ObjectId(req.userId) });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

app.post('/api/profile', authMiddleware, async (req, res) => {
  try {
    const { injury, rehab_day } = req.body;

    const result = await db.collection('profiles').updateOne(
      { userId: new ObjectId(req.userId) },
      { 
        $set: { injury, rehab_day, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    res.json({ success: true, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
