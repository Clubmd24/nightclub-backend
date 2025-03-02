require('dotenv').config(); // Load environment variables

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use environment variables for database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// ✅ Handle database connection properly
db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1); // Exit if DB connection fails
    } else {
        console.log('✅ Connected to MariaDB (ClearDB)');
    }
});

// ✅ Default route for Heroku health check
app.get('/', (req, res) => {
    res.send("✅ API is running!");
});

// ✅ API to fetch till cash data
app.get('/till-cash', (req, res) => {
    db.query('SELECT * FROM till_cash_control', (err, results) => {
        if (err) {
            console.error("❌ Error fetching till cash data:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// ✅ Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('❌ Received SIGTERM. Closing app...');
    db.end(() => {
        console.log('✅ Database connection closed');
        process.exit(0);
    });
});

// ✅ Use Heroku's dynamic port
const PORT = process.env.PORT || 5000;
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
