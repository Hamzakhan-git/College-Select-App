// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors({
  origin: ['https://college-select-app-jhcg.vercel.app/', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Connect to your Supabase PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

// 1. GET ALL COLLEGES (For Listing & Search Page)
app.get('/api/colleges', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM colleges ORDER BY rating DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET SINGLE COLLEGE (For Detail Page)
app.get('/api/colleges/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM colleges WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: "College not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. COMPARE COLLEGES (High Priority Feature)
app.post('/api/colleges/compare', async (req, res) => {
  try {
    const { ids } = req.body; // Expects an array like [1, 5, 10]
    if (!ids || !ids.length) return res.status(400).json({ message: "Provide college IDs" });
    
    // Fetch colleges where ID is in the provided array
    const { rows } = await pool.query('SELECT * FROM colleges WHERE id = ANY($1)', [ids]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST route to add a new college
app.post('/api/colleges', async (req, res) => {
  console.log("👉 1. POST request received from frontend!");
  console.log("👉 2. Data payload:", req.body);

  try {
    const { name, location, fees, rating, placement_percentage, courses } = req.body;
    
    // Insert into Supabase and return the new row
    const result = await pool.query(
      `INSERT INTO colleges (name, location, fees, rating, placement_percentage, courses) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, location, fees, rating, placement_percentage, courses]
    );
    
    console.log("✅ 3. Successfully saved to Supabase!");
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ 4. DATABASE ERROR:", err.message);
    res.status(500).json({ error: "Failed to add college", details: err.message });
  }
});

// POST route for College Predictor Tool
app.post('/api/predict', async (req, res) => {
  try {
    const { exam, rank } = req.body;
    const numericRank = parseInt(rank);

    // Rule-based logic based on rank
    let minRating = 0;
    let maxRating = 5.0;

    if (numericRank <= 10000) {
      minRating = 4.5; // Top tier
    } else if (numericRank <= 50000) {
      minRating = 4.0;
      maxRating = 4.49; // Mid tier
    } else {
      maxRating = 3.99; // Accessible tier
    }

    // Fetch colleges that match the predicted tier
    const result = await pool.query(
      `SELECT * FROM colleges WHERE rating >= $1 AND rating <= $2 ORDER BY rating DESC`,
      [minRating, maxRating]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Prediction error:", err.message);
    res.status(500).json({ error: "Failed to predict colleges" });
  }
});

// --- Q&A DISCUSSION BOARD ROUTES ---

// 1. Get all questions
app.get('/api/questions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// 2. Ask a new question
app.post('/api/questions', async (req, res) => {
  try {
    const { question } = req.body;
    const result = await pool.query(
      'INSERT INTO questions (question) VALUES ($1) RETURNING *',
      [question]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to ask question" });
  }
});

// 3. Answer a question
app.post('/api/questions/:id/answer', async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const result = await pool.query(
      'UPDATE questions SET answer = $1 WHERE id = $2 RETURNING *',
      [answer, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit answer" });
  }
});

// --- SAVED ITEMS ROUTES ---

// 1. Save a college
app.post('/api/save', async (req, res) => {
  try {
    const { username, college_id } = req.body;
    const result = await pool.query(
      'INSERT INTO saved_colleges (username, college_id) VALUES ($1, $2) RETURNING *',
      [username, college_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to save item" });
  }
});

// 2. Get saved colleges for a user
app.get('/api/saved/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const result = await pool.query(
      `SELECT c.* FROM colleges c 
       JOIN saved_colleges s ON c.id = s.college_id 
       WHERE s.username = $1`,
      [username]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch saved items" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;