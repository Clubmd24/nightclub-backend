require('dotenv').config(); // Load environment variables
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 📌 GET Payroll Report
const { Parser } = require('json2csv');

app.get('/payroll/export', (req, res) => {
    db.query(`
        SELECT users.id, users.name, shifts.allocated_hours, 
               SUM(TIMESTAMPDIFF(HOUR, clock_in, clock_out)) AS claimed_hours 
        FROM users 
        JOIN shifts ON users.id = shifts.user_id 
        LEFT JOIN clock_ins ON users.id = clock_ins.user_id 
        GROUP BY users.id, users.name, shifts.allocated_hours`, 
    (err, results) => {
        if (err) return res.status(500).send(err);

        const fields = ['id', 'name', 'allocated_hours', 'claimed_hours'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(results);

        res.setHeader('Content-Disposition', 'attachment; filename=payroll.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csv);
    });
});


// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
    });
}

// Database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ✅ Default route for health check
app.get('/', (req, res) => {
    res.send("Nightclub API is running!");
});

// 📌 GET Till Cash Transactions
app.get('/till-cash', (req, res) => {
    db.query('SELECT * FROM till_cash_control', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 📌 POST Declare Float
app.post('/till-cash/declare-float', (req, res) => {
    const { manager_id, fifty, twenty, ten, five, two, one, fifty_p, twenty_p, ten_p, five_p, copper } = req.body;
    const total_float = (50 * fifty) + (20 * twenty) + (10 * ten) + (5 * five) + (2 * two) + (1 * one) +
                         (0.5 * fifty_p) + (0.2 * twenty_p) + (0.1 * ten_p) + (0.05 * five_p) + (0.01 * copper);

                         db.query('INSERT INTO till_cash_control (manager_id, type, cash_amount) VALUES (?, ?, ?)',
                            [manager_id, 'float', total_float],
                        
    (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Float declared successfully", total_float });
    });
});

// 📌 POST End-of-Day Cash Count
app.post('/till-cash/end-of-day', (req, res) => {
    const { manager_id, fifty, twenty, ten, five, two, one, fifty_p, twenty_p, ten_p, five_p, copper, expected_total, pdq_total } = req.body;
    
    if (!manager_id) return res.status(400).json({ error: "Manager ID is required" });

    const actual_cash = (50 * fifty) + (20 * twenty) + (10 * ten) + (5 * five) + (2 * two) + (1 * one) +
                        (0.5 * fifty_p) + (0.2 * twenty_p) + (0.1 * ten_p) + (0.05 * five_p) + (0.01 * copper);
    const variance = (actual_cash + pdq_total - expected_total).toFixed(2);

    db.query('INSERT INTO till_cash_control (manager_id, type, fifty, twenty, ten, five, two, one, fifty_p, twenty_p, ten_p, five_p, copper, total_amount, variance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [manager_id, 'end-of-day', fifty, twenty, ten, five, two, one, fifty_p, twenty_p, ten_p, five_p, copper, actual_cash, variance],
    (err, results) => {
        if (err) return res.status(500).send({ error: err.message });
        res.json({ message: "End-of-Day cash count recorded", actual_cash, variance });
    });
});

// 📌 Message Board Endpoints
app.post('/messages/reply', (req, res) => {
    const { user_id, message, category, parent_id } = req.body;
    db.query('INSERT INTO messages (user_id, message, category, parent_id) VALUES (?, ?, ?, ?)',
    [user_id, message, category, parent_id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Reply posted successfully" });
    });
});


app.get('/messages', (req, res) => {
    const category = req.query.category || 'all';
    db.query('SELECT * FROM messages WHERE category = ? OR category = "all"',
    [category], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 📌 POST Clock In
app.post('/clock-in', (req, res) => {
    const { user_id, latitude, longitude } = req.body;
    const shift_start = new Date();

    db.query('INSERT INTO clock_ins (user_id, clock_in, latitude, longitude) VALUES (?, ?, ?, ?)',
    [user_id, shift_start, latitude, longitude],
    (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Clock-in successful" });
    });
});

// 📌 POST Clock Out
app.post('/clock-out', (req, res) => {
    const { user_id } = req.body;
    const shift_end = new Date();

    db.query('UPDATE clock_ins SET clock_out = ? WHERE user_id = ? AND clock_out IS NULL',
    [shift_end, user_id],
    (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Clock-out successful" });
    });
});


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
