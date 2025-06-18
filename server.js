// Load environment variables
require('dotenv').config();

// Include dependencies
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');

// Create Express app instance
const app = express();

// Middleware: parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware: method override for DELETE/PUT support
app.use(methodOverride('_method'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files from public directory
app.use(express.static('public'));

// Initialize session
app.use(session({
  secret: 'secret', // consider using process.env.SESSION_SECRET in production
  resave: false,
  saveUninitialized: true
}));

// Make session messages available to views
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// MongoDB connection
require('./models/mongoose');

// Load JSON test data
const data = require('./test.json');

// Route: Home
app.get('/', (req, res) => {
  res.render('pages/index', { title: 'Home Page' });
});

// Route: About
app.get('/about', (req, res) => {
  res.render('pages/about', { title: 'About Page' });
});

// Route: Users Index
app.get('/users', (req, res) => {
  res.render('users/index', {
    title: 'Users Page',
    users: data
  });
});

// Route: View single user by index (id - 1)
app.get('/users/view/:id', (req, res) => {
  const id = parseInt(req.params.id);
  res.render('users/view', {
    title: 'User Page',
    user: data[id - 1]
  });
});

// Mount recipe routes
const recipeRoutes = require('./routes/recipes');
app.use('/recipes', recipeRoutes);

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
