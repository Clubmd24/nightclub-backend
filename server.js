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

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1); // Exit process if DB fails
    } else {
        console.log('✅ Connected to MariaDB');
    }
});

// ✅ Default route for health check
app.get('/', (req, res) => {
    res.send("✅ API is running!");
});

// API to fetch till cash data
app.get('/till-cash', (req, res) => {
    db.query('SELECT * FROM till_cash_control', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// ✅ Handle server shutdown properly
process.on('SIGTERM', () => {
    console.log('❌ Received SIGTERM. Closing app...');
    db.end(() => {
        console.log('✅ Database connection closed');
        process.exit(0);
    });
});

// ✅ Ensure PORT is assigned correctly
const PORT = process.env.PORT || 5000;

// Check if the app is already running to avoid multiple instances
if (!module.parent) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    }).on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`❌ Port ${PORT} is already in use. Exiting...`);
            process.exit(1);
        } else {
            throw err;
        }
    });
}