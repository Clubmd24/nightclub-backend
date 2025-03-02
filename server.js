require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Default route for Heroku health check (prevents idle shutdown)
app.get('/', (req, res) => {
    res.send("🚀 API is running!");
});

// ✅ Ensure Heroku assigns a dynamic port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Database connection with keep-alive
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
        process.exit(1);
    } else {
        console.log('✅ Connected to MariaDB (ClearDB)');
    }
});

// ✅ Prevent Heroku from closing idle DB connections
setInterval(() => {
    db.ping((err) => {
        if (err) console.error('❌ Database ping failed:', err);
        else console.log('✅ Database connection is alive');
    });
}, 60000); // Ping every 60 seconds

// ✅ API to fetch till cash data
app.get('/till-cash', (req, res) => {
    db.query('SELECT * FROM till_cash_control', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// ✅ Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log("❌ Received SIGTERM. Closing app...");
    db.end(() => {
        console.log('✅ Database connection closed');
        process.exit(0);
    });
});

// ✅ Keep Heroku app alive (Ping every 5 minutes)
setInterval(() => {
    require("http").get("https://nightclubapp.herokuapp.com/");
}, 300000); // Every 5 minutes (300,000 ms)

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
