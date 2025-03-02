require('dotenv').config(); // Load .env variables

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS ? '****' : 'Not Set'); // Hide password for security
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MariaDB (ClearDB)');
    }
});

// ✅ Default Route (Fixes "Nothing Here" Issue)
app.get('/', (req, res) => {
    res.send("Nightclub Backend API is Running!");
});

// ✅ API to Fetch Till Cash Data
app.get('/till-cash', (req, res) => {
    db.query('SELECT * FROM till_cash_control', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// ✅ API to Manually Input Till Cash & EPOS Data
app.post('/till-cash', (req, res) => {
    const { station_name, shift_id, float_amount, actual_cash, epos_cash, pdq_total, epos_pdq } = req.body;
    
    const query = `
        INSERT INTO till_cash_control (station_name, shift_id, float_amount, actual_cash, epos_cash, pdq_total, epos_pdq)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [station_name, shift_id, float_amount, actual_cash, epos_cash, pdq_total, epos_pdq], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Till data saved successfully", id: result.insertId });
    });
});

// ✅ Start Server (Dynamic Port for Heroku)
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
