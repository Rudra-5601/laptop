// Import required modules
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Define a route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// create a table named 'users' with columns 'id', 'email', and 'password' if it doesn't exist
// and implement a POST route '/signup' to insert new users into the 'users' table
const { Client } = require('pg');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// PostgreSQL connection
const client = new Client({
    user: 'postgres',        // your PostgreSQL username
    host: 'localhost',
    database: 'webdb',       // database name
    password: 'yourpassword',
    port: 5432,
});
client.connect();
// Create table if not exists
client.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255)
    );
`);
// Signup route 
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await client.query(`
            INSERT INTO users (email, password)
            VALUES ($1, $2)
            RETURNING id;
        `, [email, password]);
        res.status(201).json({ userId: result.rows[0].id });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});






