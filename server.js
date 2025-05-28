
const express = require("express");
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Simple test route
app.get('/', (req, res) => {
    res.json({ message: 'Books API is running!' });
});

// Book routes
const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);

// Start server
mongodb.initDb((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    } else {
        console.log('Database connected successfully');
        app.listen(PORT, () => { 
            console.log(`Server running on port ${PORT}`);
            console.log(`Test: http://localhost:${PORT}`);
            console.log(`API: http://localhost:${PORT}/api/books`);
        });
    }
});