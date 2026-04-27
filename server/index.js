import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Groq } from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-fitness-coach';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  fitnessGoal: String,
  workoutExperience: String,
  targetPhysique: String,
  bodyFatEstimate: Number,
  activityLevel: String,
  calories: {
    maintenance: Number,
    muscleGain: Number,
    fatLoss: Number
  },
  macros: {
    protein: Number,
    carbs: Number,
    fat: Number
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

const WorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plan: Array,
  phase: String,
  createdAt: { type: Date, default: Date.now }
});
const Workout = mongoose.model('Workout', WorkoutSchema);

const DietSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plan: Array,
  totalCalories: Number,
  macros: Object,
  createdAt: { type: Date, default: Date.now }
});
const Diet = mongoose.model('Diet', DietSchema);

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  weight: Number,
  completionRate: Number,
  streak: Number,
  date: { type: Date, default: Date.now }
});
const Progress = mongoose.model('Progress', ProgressSchema);

// AI Client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send({ error: 'Please authenticate.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, age, gender, height, weight, fitnessGoal, workoutExperience, targetPhysique, activityLevel } = req.body;
    
    // Simple BMR/TDEE calculation (Mifflin-St Jeor)
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725
    };
    
    const maintenance = Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));
    const protein = Math.round(weight * 2.2); // 2.2g per kg
    const fat = Math.round(maintenance * 0.25 / 9);
    const carbs = Math.round((maintenance - (protein * 4 + fat * 9)) / 4);

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({
      ...req.body,
      password: hashedPassword,
      calories: {
        maintenance,
        muscleGain: maintenance + 300,
        fatLoss: maintenance - 500
      },
      macros: { protein, carbs, fat }
    });
    
    await user.save();
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'secret');
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'secret');
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.get('/api/users/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

// AI Coach Plan (Get existing or generate first time)
app.get('/api/coach/plan', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    const diet = await Diet.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if (workout && diet) {
      return res.send({ workoutPlan: workout.plan, dietPlan: diet.plan, phase: workout.phase });
    }

    // If no plan, we fallback to a simplified trigger or return 404 to let frontend handle first generation
    res.status(404).send({ message: 'No plan found. Please generate one.' });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// AI Coach Generation (Force regenerate)
app.post('/api/coach/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Phase logic based on experience or time
    const weeksActive = Math.floor((new Date() - user.createdAt) / (7 * 24 * 60 * 60 * 1000));
    let phase = user.workoutExperience;
    if (weeksActive >= 4 && phase === 'beginner') phase = 'intermediate';
    if (weeksActive >= 16 && (phase === 'intermediate' || phase === 'beginner')) phase = 'advanced';

    const prompt = `
      Act as an elite AI Fitness Coach. 
      User Profile: ${user.age}y/o ${user.gender}, ${user.weight}kg, ${user.height}cm.
      Goal: ${user.fitnessGoal}, Experience: ${user.workoutExperience}, Target: ${user.targetPhysique}.
      Current Phase: ${phase} (${weeksActive} weeks active).
      
      CRITICAL: Generate a FIXED 7-day weekly schedule.
      Standard Split Rules:
      - Beginner: Full Body 3x per week (Mon, Wed, Fri), others Rest.
      - Intermediate: Single Muscle Split (Mon: Chest, Tue: Back, Wed: Shoulders, Thu: Legs, Fri: Arms, others Rest).
      - Advanced: Double Muscle Split (Mon: Chest/Back, Tue: Legs/Calves, etc.)
      
      Generate exactly:
      1. A weekly workout plan (JSON array 'workoutPlan') with EXACTLY 7 objects. 
         REQUIRED Order: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
         Each object MUST have: 'day', 'focus', 'exercises' (array of {name, reps, muscle}).
      2. A weekly diet plan (JSON array 'dietPlan') with EXACTLY 7 objects.
         REQUIRED Order: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
         Each object MUST have: 'day', 'meals' (array of {meal, items, calories, macros_string}).
      3. A prediction of physique transformation over the next 3 months (string 'prediction').
      
      IMPORTANT: 'macros_string' should be a single string like "P:150g C:200g F:60g".
      Return as valid JSON.
    `;
    
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' }
    });
    
    const data = JSON.parse(completion.choices[0].message.content);
    
    // Save generated plans with identified phase
    const workout = new Workout({ userId: user._id, plan: data.workoutPlan, phase: phase });
    await workout.save();
    
    const diet = new Diet({ userId: user._id, plan: data.dietPlan, totalCalories: user.calories.maintenance, macros: user.macros });
    await diet.save();
    
    res.send({ ...data, phase });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.post('/api/coach/chat', auth, async (req, res) => {
  try {
    const { message, history } = req.body;
    const user = await User.findById(req.user._id);
    
    const messages = [
      { 
        role: 'system', 
        content: `You are an elite AI Fitness Coach named "Titan". 
        User Context: Age ${user.age}, Weight ${user.weight}kg, Goal: ${user.fitnessGoal}. 
        Keep responses concise, professional, motivational, and scientifically grounded. 
        Always focus on proper form and consistency.` 
      },
      ...history,
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.1-8b-instant',
    });

    res.send({ reply: completion.choices[0].message.content });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.get('/api/progress', auth, async (req, res) => {
  const stats = await Progress.find({ userId: req.user._id }).sort({ date: 1 });
  res.send(stats);
});

app.post('/api/progress', auth, async (req, res) => {
  const progress = new Progress({ ...req.body, userId: req.user._id });
  await progress.save();
  res.send(progress);
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
