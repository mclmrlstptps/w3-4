const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('./data/database');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "fallback-secret-key-change-this",
    resave: false,
    saveUninitialized: true,
}));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes/index.js"));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Passport configuration
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Auth routes
app.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? 
        `Logged in as ${req.session.user.displayName}` : "Logged Out");
});

app.get('/login', passport.authenticate('github'));

app.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/api-docs' }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    }
);

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Book routes
const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);

// User Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

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
            console.log(`Docs: http://localhost:${PORT}/api-docs`);
        });
    }
});







// const express = require("express");
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mongodb = require('./data/database');
// const dotenv = require('dotenv');
// const passport = require('passport');
// const session = require('express-session');
// const GitHubStrategy = require('passport-github2').Strategy;
// const userRoutes = require('./routes/userRoutes');

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Basic middleware
// app.use(bodyParser.json());
// app.use(session({
//     secret: process.env.SESSION_SECRET || "fallback-secret-key-change-this",
//     resave: false,
//     saveUninitialized: true,
// }));

// // CORS setup 
// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// // Routes
// app.use("/", require("./routes/index.js"));

// // Passport configuration
// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: process.env.CALLBACK_URL
// },
// function(accessToken, refreshToken, profile, done) {
//     return done(null, profile);
// }));

// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser((user, done) => {
//     done(null, user);
// });

// // Auth routes
// app.get('/', (req, res) => {
//     res.send(req.session.user !== undefined ? 
//         `Logged in as ${req.session.user.displayName}` : "Logged Out");
// });

// // GitHub OAuth routes
// app.get('/login', passport.authenticate('github'));

// app.get('/github/callback', 
//     passport.authenticate('github', { failureRedirect: '/api-docs' }),
//     (req, res) => {
//         req.session.user = req.user;
//         res.redirect('/');
//     }
// );

// app.get('/logout', (req, res) => {
//     req.session.destroy();
//     res.redirect('/');
// });

// // API routes
// const bookRoutes = require('./routes/bookRoutes');
// app.use('/api/books', bookRoutes);
// app.use('/api/users', userRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Something went wrong!' });
// });

// // 404 handler
// app.use('*', (req, res) => {
//     res.status(404).json({ error: 'Route not found' });
// });

// // Start server
// mongodb.initDb((err) => {
//     if (err) {
//         console.error('Database connection failed:', err);
//         process.exit(1);
//     } else {
//         console.log('Database connected successfully');
//         app.listen(PORT, () => { 
//             console.log(`Server running on port ${PORT}`);
//             console.log(`Test: http://localhost:${PORT}`);
//             console.log(`API: http://localhost:${PORT}/api/books`);
//         });
//     }
// });